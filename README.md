这篇文章记录了使用 angular 实现 web 前端选择文件的预览组件。Angular 版本为 7.3.7

# 初始环境

使用`ng new --routing --style scss hello-ng`创建新的 angular 项目。

`--routing` 项目使用 angular 路由

`--style scss`项目使用 sass

切换到`src/app`目录，使用 `ng g c image-preview`创建 angular 组件

`ng g c`是 `ng generate component` 的缩写,`ng generate`可用于快速创建`module,component,directive`等，具体用法可使用`ng g --help`查看

# 初始版本

![深度截图_选择区域_20190330211601](https://docs.deepin.io/wp-content/uploads/2019/03/深度截图_选择区域_20190330211601-300x272.png)
图 1

代码如下

html

```html
<input type="file" accept="image/*" hidden (change)="change(inputRef)" #inputRef />
<div (click)="inputRef.click()">
  <img *ngIf="preview" [src]="preview" />
  <span>点击上传</span>
</div>
```

scss

```scss
div {
  width: 200px;
  height: 200px;
  border: 2px gray dashed;
  display: flex;
  justify-content: center;
  align-items: center;
}
img[src] + span {
  display: none;
}
```

模板文件共有四个元素，分别是 input,div,img,span。input 用`hidden`属性隐藏，关联 div 和 input 的点击事件，实现点击 div 时，弹出文件选择对话框。`#inputRef`是 angular 的模板引用变量，在此处引用了 input 元素，两者相等。在 input 上还绑定了 change 事件，并且把 input 元素传入。下面在组件的 change 方法里处理图片文件，以实现预览。

```typescript
  change(input: HTMLInputElement) {
    if (input.files.length < 1) {
      return;
    }
    this.preview = window.URL.createObjectURL(input.files[0]);
  }
```

这里使用`URL.createObjectURL`创建 blob 链接，远比以前的 base64 image 方法要高效。特别是图片文件较大时，base64 image 的方式会因为页面插入大量编码数据，造成页面卡顿，而 blob 链接无论文件大小，都会生成类似`blob:http://127.0.0.1:4200/8aa78310-7e5f-429f-a00f-316e416fb0e2`这种短链接。
`preview`是组件类的一个普通属性，之前已经在模板中绑定在 img 元素的 src 上，所以这样就大功告成了！？为什么图片不显示

![深度截图_选择区域_20190330214715](https://docs.deepin.io/wp-content/uploads/2019/03/深度截图_选择区域_20190330214715-300x284.png)

# 安全

原来 angular 为了防止[XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击

> 默认把所有值都当做不可信任的。[angular 安全相关文档](https://angular.cn/guide/security)

结果误伤了 blob 链接，在浏览器中审查元素可看到链接前面添加了 unsafe 标示![深度截图_选择区域_20190331135331](https://docs.deepin.io/wp-content/uploads/2019/03/深度截图_选择区域_20190331135331.png)

这种情况就要[DomSanitizer](https://angular.cn/api/platform-browser/DomSanitizer#description)出马了。

```typescript
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
```

在这里使用[DomSanitizer.bypassSecurityTrustUrl](https://angular.cn/api/platform-browser/DomSanitizer#bypasssecuritytrusturl)让生成的 blob 链接绕过安全检查,因为我们信任浏览器生成的链接(_当链接来源于用户输入，就要小心你的信任别被辜负了_)  
到此为止，它已经可以正常工作了，但图片上传预览只是表单的一小部分，下面来把它封装为 Angular 表单组件。

# ControlValueAccessor

Angular 中提供了两种方式处理表单输入

1. 模板驱动表单
1. 响应式表单
