import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitAttempted = false;
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
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

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    this.submitAttempted = true;

    if (this.registerForm.valid) {
      console.log('Register form submitted', this.registerForm.value);
      const { fullName, email, password } = this.registerForm.value;

      this.authService.register({ fullName, email, password }).subscribe({
        next: (res) => {
          console.log('Registration success', res);
          this.showSuccessAnimation();
        },
        error: (err) => {
          console.error('Registration failed', err);
          console.log("error");
        }
      });

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
      this.router.navigate(['/login']);
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}