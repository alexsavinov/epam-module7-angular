import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

import {emptyTag, ITag} from "../../interfaces";
import {TagService} from "../../services";
import {CustomErrorStateMatcher} from "../../../../shared";

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
              private router: Router) {
  }

  ngOnInit() {
    if (this.router.url == '/tags/add') {
      this.creating = true;
    }

    if (this.creating) {
      this.tag = emptyTag();
      this._createForm();
    } else {
      this.activatedRoute.params.subscribe(({id}) => {
        this.activatedRoute.data.subscribe(({data}) => {
          this.tag = data as ITag;
          this._createForm();
        });
      });
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
    this.location.back();
    // this.router.navigate(['users']);
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
          this.infoMessage = `Tag created..`;
          this.tag = value;
          setTimeout(() => {
            this.form.reset();
            // this.router.navigate(['users/' + value.id]);
            this.router.navigate(['tags']);
          }, 2000);
        },
        error: e => {
          console.log(e)
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
          this.infoMessage = `Tag (id=${value.id}) updated..`;
          this.tag = value;
          this.form.reset();
          this._createForm();
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }
}
