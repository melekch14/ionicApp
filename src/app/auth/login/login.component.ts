import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitAttempted = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private animationCtrl: AnimationController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.animateBackground();
  }

  animateBackground() {
    const background = document.querySelector('.auth-background');
    if (!background) return;

    const animation = this.animationCtrl.create()
      .addElement(background)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('background-position', '0% 0%', '100% 100%')
      .easing('ease-in-out');

    animation.play();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitAttempted = true;
    
    if (this.loginForm.valid) {
      console.log('Login form submitted', this.loginForm.value);
      this.showSuccessAnimation();
    }
  }

  showSuccessAnimation() {
    const button = document.querySelector('.auth-button');
    if (!button) return;

    const buttonAnimation = this.animationCtrl.create()
      .addElement(button)
      .duration(500)
      .fromTo('transform', 'scale(1)', 'scale(0.95)')
      .fromTo('--background', 'linear-gradient(135deg, #6e8efb, #a777e3)', 'linear-gradient(135deg, #4CAF50, #45a049)')
      .afterStyles({
        '--box-shadow': '0 2px 10px rgba(76, 175, 80, 0.5)'
      })
      .afterClearStyles(['transform']);

    buttonAnimation.play();
    
    setTimeout(() => {
      this.router.navigate(['/home']); // Redirect to home after successful login
    }, 1000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}