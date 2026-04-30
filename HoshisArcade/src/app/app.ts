import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLogin } from "./components/estructura/navbar-login/navbar-login";
import { Navbar } from './components/estructura/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarLogin, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HoshiArcades');
}
