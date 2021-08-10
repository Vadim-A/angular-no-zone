import { ChangeDetectorRef, Component, OnDestroy, OnInit, ɵmarkDirty as markDirty } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-no-zone';
  userName = 'user';
  userName$ = new BehaviorSubject<string>(this.userName);
  disabled = !this.userName.length
  nameControl = new FormControl(this.userName);

  private ngUnsubscribe$ = new Subject();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe$)
      ).subscribe((name: string) => {
        this.disabled = !name.length;
        markDirty(this);
        // this.cdr.detectChanges();
      })
  }

  onSetUserClick() {
    this.userName = this.nameControl.value;
    this.userName$.next(this.userName);
    markDirty(this);
    // this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}

