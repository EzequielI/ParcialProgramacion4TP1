import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMensajes } from './chat-mensajes';

describe('ChatMensajes', () => {
  let component: ChatMensajes;
  let fixture: ComponentFixture<ChatMensajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMensajes],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMensajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
