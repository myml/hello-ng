import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImagePreviewComponent,
    },
  ],
})
export class ImagePreviewComponent implements OnInit, ControlValueAccessor {
  preview: SafeUrl;
  constructor(private safe: DomSanitizer) {}
  onChange: (value: string) => void;
  ngOnInit() {}

  change(input: HTMLInputElement) {
    if (input.files.length < 1) {
      return;
    }
    const file = input.files[0];
    const url = window.URL.createObjectURL(file);
    this.onChange(url);
    this.preview = this.safe.bypassSecurityTrustUrl(url);
  }

  writeValue(obj: any): void {
    this.preview = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
