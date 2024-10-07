import { Injectable } from '@angular/core';
import { User } from '../Models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService{
    users: User[] = [
        new User(1, 'DDD', 'DDD', '12345'),
        new User(2, 'AAA', 'AAA', '12345'),
        new User(3, 'BBB', 'BBB', '12345'),
        new User(4, 'CCC', 'CCC', '12345')
    ]
}