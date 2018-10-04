import { Component, OnInit } from '@angular/core';
import { UserService } from "../service/user.service";
import { Router } from "@angular/router";
import { User } from "../model/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  editForm: FormGroup;
  submitted: boolean = false;
  genders = ['F', 'M'];

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit() {
    let userId = localStorage.getItem("editUserId");
    if (!userId) {
      alert("Invalid action.")
      this.router.navigate(['list-user']);
      return;
    }
    this.editForm = this.formBuilder.group({
      Id: [],
      Email: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Gender: ['', Validators.required]
    });



    this.userService.getUserById(+userId)
      .subscribe(data => {
        this.editForm.setValue(data);
        // this.editForm.patchValue({
        //   Email: data.Email,
        //   FirstName: data.FirstName,
        //   LastName: data.LastName,
        //   Gender: data.Gender
        // })
      });
  }

  onSubmit() {

    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    if (this.editForm.controls.LastName.errors) {
      return;
    }
    if(this.editForm.controls.Gender.errors){
      return;
    }
    
    this.userService.updateUser(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['list-user']);
        },
        error => {
          alert(error);
        });
  }

}
