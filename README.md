<div align="center">
<h1>Simple-web-image-editor</h1>

<p>
  A simple image editor web app built with vanilla Javascript and HTML5 Canvas.
</p>

[Live demo here](https://craciuncezar.github.io/Simple-web-image-editor/)
  
![paint](https://user-images.githubusercontent.com/27342306/147604256-15310497-586b-466e-b38f-a19ed402f4c0.png)
  
</div>

## ABOUT

Begin by dragging and dropping an image from your computer. Draw on the image, crop it, and resize it before saving it to your computer.
Users can choose to draw over the image using predefined forms such as ellipses, rectangles, and lines, or they can draw freely. Change the image size while maintaining the aspect ratio, or crop it to remove undesired sections. Apply filters like Grayscale, Threshold, Sephia, or Invert Colors. Do all of the above while also keeping a history of the changes and undo or redo if neeeded.

## Ok, but why?

This was my first web app, it was initially written with jQuery back when frontend libs like React were not a mainstream thing yet, I decided to get rid of the jQuery part and keep things as simple as possible, no dependencies, evertything as lightweight as possible. This app is indeed a simple one, the code is not the most performing one, and it lacks features for sure, but for an app with around 450 lines of JS code I think is a darn cool one, and it does the job, a remainder that overengineering stuff is in most cases a path to failure.

## Running the app

If for whatever reason you want to work on this app, you can simply open the html file in a browser, there is no need for a bundle. Or you can use a dev server. There is also an npm script using vite as a dev server:

```
npm install
npm run dev
```

Bundling is frankly optional here but it does save some bytes by minifing the js files and can be done with:

```
npm install
npm run build
```
