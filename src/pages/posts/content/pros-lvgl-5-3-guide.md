---
title: 'PROS LVGL 5.3 Guide'
date: 2025-07-08
description: 'A Guide to using LVGL 5.3 with PROS'
author: 'ABUCKY0'
banner: /blog/lvgl-logo-lvgl53-guide.png
tags: ["vex", "robotics", "lvgl", "graphics", "guide"]
---
## Prelude
Note: This was made with LVGL 5.3 and PROS 3

This is a starter guide with some of the information I learned when making my GUI. This is meant to help you get started with your own, but isn't a replacement for reading the documentation.
That being said, here are some links that can help you get started faster:
- ### I ***Highly*** recommend starting off by designing your UI in Canva or a similar program. It *will* make your life easier since you won't have to manually figure out your positioning for objects.

I also recommend reading Team 81K's tutorial, I don't plan on repeating a large portion of the same information here that's already in their tutorial. 
- 81K's Tutorial: https://team81k.github.io/ProsLVGLTutorial/

- The Docs as a PDF: https://github.com/GCEC-2918/LVGL_v5-3_Documentation_Archive/blob/main/docs_v5_3/pdf/LittlevGL_documentation_English.pdf
- The Docs: https://gcec-2918.github.io/LVGL_v5-3_Documentation_Archive/
- PROS Docs: https://pros.cs.purdue.edu/v5/tutorials/topical/display.html
- LVGL 5.3 Demos: https://github.com/lvgl/lv_demos/tree/v5.3 
- Image Converter: https://lvgl.github.io/lv_img_conv/
- Directly from SD Card Images: https://github.com/theol0403/gif-pros
- Font Converter: https://lvgl.io/tools/font_conv_v5_3
### Some Other Information
- You don't need to do any LVGL initalization.
- LLEMU and LVGL are incompatible. See the PROS Docs link above.
# Table of Contents
(Coming Soon)

# Designing your UI
If you plan on designing your UI in Canva, here's what I reccomend.
1. Design your UI with the brain's screen size in mind. Your screen is likely 2-3x larger than the Vex Brain. Designing with that in mind will allow your buttons to not be too small, like mine were. 
2. Always resize your images to fit on your screen. I haven't been able to figure out how to properly resize large images into ones that fit in how you want them to on the Brain. You can export resized Canva images by dragging a shape on top of your element, resizing it to fit inside of the image, and then making the color completely transparent. Then select both the image and the newly invisible element using Ctrl+Click, and then right click and press `Download Selection`.

# Images
#### Image Converter: https://lvgl.io/tools/imageconverter (I believe you can select LVGL 8, or you can use https://lvgl.github.io/lv_img_conv/)
#### GIF-Pros: https://github.com/theol0403/gif-pros

Gif-Pros exists, which should in theory you to use GIFs from an SD card directly in PROS without conversion. I haven't been able to get it working, but your mileage may vary.
~~When you finish designing your UI, you need to translate all images into C arrays,~~ and convert fonts into ones usable by LVGL. Use the Image Converter to convert images to C Arrays. 

### When you convert your image to a C array using imageconverter, you need to do a few things:

1) Remove all spaces from your filename. 
2) Upload your Image
3) Select CF_TRUE_COLOR or CF_TRUE_COLOR_ALPHA
4) Select C Array as the output format
5) Press the confirm button, then download your image. 
6) Open it in Visual Studio Code

On line 12, change `#include "lvgl/lvgl.h"`   
![image](https://gist.github.com/assets/81783950/03dc8433-05d3-4b8d-9871-ecdf5ec3ac7c)  
to `#include "pros/apix.h"  

Delete the two `#ifndef` statements following the `pros/apix.h` header.   
![image](https://gist.github.com/assets/81783950/9ab6ecb4-56ca-4e95-a397-2755a3e14834)   

Then delete the three `LV_ATTRIBUTE`s in the c array image map.
![image](https://gist.github.com/assets/81783950/50c14bb3-cb03-495f-a4ba-a87e13ef5215)  

The top portion of your image file should now look like this:   
![image](https://gist.github.com/assets/81783950/774270b1-687d-4e9c-8ab6-d3bae27f0af6)


# Custom Fonts
#### Font Converter: https://lvgl.io/tools/font_conv_v5_3

Use the following settings for normal (latin) characters:
- First Unicode: 32
- Last Unicode: 126
 
All other options are up to you.

Change `#include "lvgl/lvgl.h"` to .h`#include "pros/apix"`

# Starting out
PROS already ported and initalizes LVGL, so you can ignore those portions. A screen is already created when PROS starts, and you can retreve this screen using `lv_scr_act()`. You can also make your own screen using `lv_obj_t* customScreen =  lv_obj_create(NULL, NULL);`

Custom Styles can be created using the following code: 
```cpp
static lv_style_t style_bg;
	lv_style_copy(&style_bg, &lv_style_plain);
```
and added to elements using the following line: `lv_obj_set_style(object, style);`