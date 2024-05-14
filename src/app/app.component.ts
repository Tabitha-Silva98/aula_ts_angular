import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnderecoService } from './services/endereco.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'aula_ts_angular';

  profileForm = this.fb.group({
    nomeCompleto: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    cpf: [
      '',
      [Validators.required, Validators.minLength(11), Validators.maxLength(11)],
    ],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    cep: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
    ],
    endereco: this.fb.group({
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService
  ) {
    this.profileForm
      .get('cep')
      ?.valueChanges.pipe(filter((cep) => cep?.length === 8))
      .subscribe((cep) => {
        this.enderecoService.getEndereco(cep!).then((endereco) => {
          console.log(endereco);

          this.profileForm.patchValue({
            endereco: {
              rua: endereco.logradouro,
              numero: endereco.numero?.toString(),
              complemento: endereco.complemento,
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              estado: endereco.uf,
            },
          });
        });
      });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }

  logFormValidations() {
    console.log(this.profileForm.valid);
    console.log(this.profileForm.errors);
    console.log(this.profileForm);
  }
}
