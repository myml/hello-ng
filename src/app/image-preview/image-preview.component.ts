import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-image-preview",
  templateUrl: "./image-preview.component.html",
  styleUrls: ["./image-preview.component.scss"]
})
export class ImagePreviewComponent implements OnInit {
  preview = "";
  constructor() {}

  ngOnInit() {}
  change(input: HTMLInputElement) {
    if (input.files.length < 1) {
      return;
    }
    const file = input.files[0];
    this.preview = window.URL.createObjectURL(file);
  }
}
