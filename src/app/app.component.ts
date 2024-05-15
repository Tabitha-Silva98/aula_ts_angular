import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnderecoService } from './services/endereco.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface ErrorMessages {
  [key: string]: {
    [key: string]: string;
  };
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'aula_ts_angular';
  submitted = false;

  //formGruop do angular
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
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    estado: ['', Validators.required],
  });

  //parametrização das mensagem retorno de cada input
  errorMessages: ErrorMessages = {
    nomeCompleto: {
      required: 'Nome completo é obrigatório.',
    },
    dataNascimento: {
      required: 'Data de nascimento é obrigatória.',
    },
    cpf: {
      required: 'CPF é obrigatório.',
      minlength: 'CPF deve ter 11 dígitos.',
      maxlength: 'CPF deve ter 11 dígitos.',
    },
    email: {
      required: 'Email é obrigatório.',
      email: 'Por favor, insira um email válido.',
    },
    telefone: {
      required: 'Telefone é obrigatório.',
    },
    cep: {
      required: 'CEP é obrigatório.',
      minlength: 'CEP deve ter 8 dígitos.',
      maxlength: 'CEP deve ter 8 dígitos.',
    },
    rua: {
      required: 'Rua é obrigatória.',
    },
    numero: {
      required: 'Número é obrigatório.',
    },
    bairro: {
      required: 'Bairro é obrigatório.',
    },
    cidade: {
      required: 'Cidade é obrigatória.',
    },
    estado: {
      required: 'Estado é obrigatório.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService
  ) {
    // ouve as mudanças no campo CEP do formulário. Quando um CEP válido (com 8 dígitos) é inserido,
    // ele chama o serviço EnderecoService para obter informações sobre o endereço correspondente a esse CEP.
    // preenche automaticamente os campos de endereço do formulário com as informações obtidas.
    this.profileForm
      .get('cep')
      ?.valueChanges.pipe(filter((cep) => cep?.length === 8))
      .subscribe((cep) => {
        this.enderecoService.getEndereco(cep!).then((endereco) => {
          console.log(endereco);

          this.profileForm.patchValue({
            rua: endereco.logradouro,
            numero: endereco.numero?.toString(),
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.uf,
          });
        });
      });
  }

  //retorna todos os controles de formulário do FormGroup 'profileForm'.
  get formulario(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      alert(
        'Formulário Validado, conteudo: ' +
          JSON.stringify(this.profileForm.value, null, 2)
      );
    }
    this.submitted = true;
  }

  //retorna a primeira mensagem de erro do controle de formulário especificado, se houver algum erro.
  getFirstErrorMessage(controlName: string) {
    const controlErrors = this.profileForm.get(controlName)?.errors;
    if (controlErrors) {
      const firstErrorKey = Object.keys(controlErrors)[0];
      return this.errorMessages[controlName][firstErrorKey];
    }
    return null;
  }

  removerSubmitted() {
    this.submitted = false;
  }
}
