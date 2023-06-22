import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

import {emptyTag, ITag} from "../../interfaces";
import {TagService} from "../../services";
import {CustomErrorStateMatcher, ModalConfirmComponent} from "../../../../shared";


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  tag: ITag;
  form: FormGroup;

  matcher = new CustomErrorStateMatcher();
  creating: boolean;

  infoMessage: string;
  errorMessage: string;

  constructor(private tagService: TagService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              private matDialog: MatDialog,
              public dialogRef: MatDialogRef<TagComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, creating: boolean }) {
  }

  ngOnInit() {
    if (this.data) {
      if (this.data['creating']) {
        this.creating = true;
        this.tag = emptyTag();
        this._createForm();
      } else {
        const id: string = this.data['id'].toString();
        this.tagService.getById(id).subscribe(data => {
          this.tag = data as ITag;
          this._createForm();
        });
      }
    }
  }

  _createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        this.tag.name,
        [
          Validators.required,
          Validators.minLength(4)
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
      this.createTag(form);
    } else {
      this.updateTag(form);
    }
  }

  private createTag(form: FormGroup<any>) {
    const tag: ITag = {
      name: form.value.name,
    }

    this.tagService.create(tag).subscribe({
        next: (value) => {
          this.infoMessage = `Creating Tag '${value.name}'..`;
          this.tag = value;
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

  private updateTag(form: FormGroup<any>) {
    const tag: ITag = {
      id: this.tag.id as number,
      name: form.value.name
    }

    this.tagService.update(tag).subscribe({
        next: (value) => {
          this.infoMessage = `Updating Tag (id=${value.id})..`;
          this.tag = value;
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
