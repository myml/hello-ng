import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
  preview: SafeUrl;
  constructor(private safe: DomSanitizer) {}

  ngOnInit() {}

  change(input: HTMLInputElement) {
    if (input.files.length < 1) {
      return;
    }
    const file = input.files[0];
    const url = window.URL.createObjectURL(file);
    this.preview = this.safe.bypassSecurityTrustUrl(url);
  }
}
