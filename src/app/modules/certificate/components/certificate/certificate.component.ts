import {Component, inject, Inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';

import {emptyCertificate, ICertificate} from '../../interfaces';
import {CustomErrorStateMatcher, ModalConfirmComponent} from '../../../../shared';
import {CertificateService} from '../../services';
import {ITag} from '../../../tag/interfaces';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';
import {AuthService} from '../../../auth/services';
import {EnumRole} from '../../../auth/interfaces';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  certificate: ICertificate;
  form: FormGroup;

  matcher = new CustomErrorStateMatcher();
  creating: boolean;

  infoMessage: string;
  errorMessage: string;
  hasRoleAdmin: boolean;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = inject(LiveAnnouncer);

  tags: ITag[];

  constructor(private certificateService: CertificateService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              private matDialog: MatDialog,
              public dialogRef: MatDialogRef<CertificateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, creating: boolean }) {
  }

  ngOnInit() {
    this.hasRoleAdmin = this.authService.hasRole(EnumRole.ROLE_ADMIN);
    if (this.data) {
      if (this.data['creating']) {
        this.creating = true;
        this.certificate = emptyCertificate();
        this.tags = this.certificate.tags;
        this._createForm();
      } else {
        const id: string = this.data['id'].toString();
        this.certificateService.getById(id).subscribe(data => {
          this.certificate = data as ICertificate;
          this.tags = this.certificate.tags;
          this._createForm();
        });
      }
    }

  }

  addTag(event: MatChipInputEvent): void {
    if (!this.hasRoleAdmin) {
      return;
    }

    const value = (event.value || '').trim();
    if (value) {
      this.certificate.tags.push({name: value});
    }
    event.chipInput!.clear();
  }

  removeTag(tag: ITag): void {
    if (!this.hasRoleAdmin) {
      return;
    }

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  editTag(tag: ITag, event: MatChipEditedEvent) {
    if (!this.hasRoleAdmin) {
      return;
    }

    const value = event.value.trim();

    // Remove Tag if it no longer has a name
    if (!value) {
      this.removeTag(tag);
      return;
    }

    // Edit existing Tag
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }

  _createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        this.certificate.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
      description: new FormControl(
        this.certificate.description,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(1000)
        ]),
      price: new FormControl(
        this.certificate.price,
        [
          Validators.required,
          Validators.min(0)
        ]),
      duration: new FormControl(
        this.certificate.duration,
        [
          Validators.required,
          Validators.min(0)
        ])
    })
  }

  back(event: MouseEvent) {
    event.preventDefault();

    if (this.form.dirty) {
      const dialogRef = this.matDialog.open(ModalConfirmComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(false);
        }
      });
    } else {
      this.dialogRef.close(false)
    }
  }

  onSubmit(form: FormGroup) {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.creating) {
      this.createCertificate(form);
    } else {
      this.updateCertificate(form);
    }
  }

  private createCertificate(form: FormGroup<any>) {
    const certificate: ICertificate = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      duration: form.value.duration,
      tags: this.tags
    }

    this.certificateService.create(certificate).subscribe({
        next: (value) => {
          this.infoMessage = `Certificate '${value.name}' created..`;
          this.certificate = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.name);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }

  private updateCertificate(form: FormGroup<any>) {
    const certificate: ICertificate = {
      id: this.certificate.id as number,
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      duration: form.value.duration,
      tags: this.tags
    }

    this.certificateService.update(certificate).subscribe({
        next: (value) => {
          this.infoMessage = `Certificate (id=${value.id}) updated..`;
          this.certificate = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.name);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }
}
