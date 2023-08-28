import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../helper/auth/auth.service'
import * as serverAddress from '../../../../config/serve.address';


@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.css']
})

export class PassportComponent implements OnInit {
  
  //全局变量
  public username: string;
  public password: string;
  public error: string;
  validateForm!: FormGroup;
  isLoading = false;

  constructor(private message: NzMessageService, private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    this.isLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => {
          if(result){
            this.isLoading = false;
            this.message.success('登录成功！');
            this.router.navigate(['/home'])
          }else{
            this.isLoading = false;
            this.message.error('登录失败，用户名或密码错误！');
            this.router.navigate(['/login'])
          }
        },
        err => this.error = '未授权！'
      );
  }

}
