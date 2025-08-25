import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  name = '';
  email = '';
  message = '';

 onSubmit(form: any) {
  if (form.invalid) {
    alert('Please fill out all required fields');
    return;
  }
  alert('Form submitted successfully!');
}

}
