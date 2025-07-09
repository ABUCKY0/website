---
title: 'Vex WS2812B LED Strips Guide'
date: 2025-07-08
description: 'A Guide on Using WS2812B LED Strips with a V5 VEX Robotics Brain'
author: 'Astro Learner'
banner: https://static.platform.michaels.com/2c-prd/152781609129696.jpg
tags: ["vex", "robotics", "ws2812b", "leds", "guide"]
---
## Resources
This section contains links to other resources either used to write this gist or other information I deemed useful for users of these led strips.  

- *WS2812B Datasheet* - https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf
- *WS2812B and Logic Level Shifters Video* (Ignore the main question of whether it's worth it, that will be discussed later) - https://www.youtube.com/watch?v=Q9mLitVxF3c
- https://electricfiredesign.com/2021/03/12/logic-level-shifters-for-driving-led-strips/ - A more techincal expanation of the logic behind driving these LEDs, and aided in writing `Why some WS2812B LED strips don't work`

## Introduction
WS2812B LEDs are complicated to get working with a VEX Robotics brain. There are many issues and tricks to get different strips working, and oftentimes the best advice given by members of the robotics community is "Buy this specific type of strip and hope to god it works". This gist aims to clarify different methods of getting these LED strips to function, and will provide solutions to users who _already_ purchased a set of LEDs which fail to function properly when connected to a VEX Robotics brain.  

## Parts List
Parts needed to build a strip for use with the LEDs. Parts needed for the actual strips themselves will be marked with a \*, while tools needed for assembly will be left unmarked. Tools recommended will be marked with a ^. Optional components will be prefixed with an !. (Refer to the Purchasing Guide and other sections to see when you'll need these.)

- Soldering Iron
- Solder
- Wire Strippers and Cutters
- \*3-Wire Cables
- \*WS2812B LED Strips
- !\*Logic Level Shifters

> [!IMPORTANT] 
> DO NOT USE GENERIC Amazon Logic Level Shifters, make sure to get a pack of Texas Instruments SN74HCT125 logic level shifters. 
> DO NOT PURCHASE ones with 74HC125 or other types of shifters without doing the research to ensure it will work for WS2812B LED strips. 
> > I recommend 74HCT125 since that's what [jpearman suggested on VexForum](https://www.vexforum.com/t/v5-addressable-leds/106960/14?u=notjohnnytamale) or a 74AHCT245 buffer, since it's recommended on [multiple](https://www.reddit.com/r/FastLED/comments/ddkr0g/only_single_ws2812b_lights_up/) different [posts](https://archive.is/EvWYs).

## Purchasing Guide
For the easiest experience, it's recommended you purchase a set of WS2812B LEDs that are advertised as having 144 LEDs per meter. (44 LEDs per foot for us Americans, but most strips are advertised in LEDs/m not LEDs/ft). 

However, if you wish to buy any other set of WS2812B LEDs, you'll need to also purchase a set of Logic Level Shifters. The reason why will be explained later.  
> [!IMPORTANT]
> Make sure that you purchase Texas Instruments' 74AHCT245 or 74AHCT145. They may be referred to as SNx4AHCT245 or SNx4AHCT145

You'll also need several [VEX Robotics 3-Wire extension cables](https://www.vexrobotics.com/extension-cables.html), or generic 3-Wire Servo cables. The VEX 3-Wire extension cables are easier to use in the long run since it will have the notch to prevent plugging in the cable the wrong way, but any generic and similar 3-Wire cable should work fine and should not mess up your LED strips if accidentally plugged in the wrong way.  

## Wiring Section 
> [!WARNING]
> The VEX Brain and PROS/VEXcode supports only between 1 and 64 LEDs. Using 65 or above **WILL NOT WORK**. Cut your strips along the dotted cut line between each LED. In the diagrams below, it's labeled with a vertical dotted line, and on your physical strips will likely also have an image of a pair of scissors. 


### Wiring a WS2812B LED Strip without other parts.
For this first section, I'll assume that you purchased the 144 LED/m strips and that they work without a Logic Level shifter or a Diode (more on those methods later).

VEX's three wire cables are coded as follows:

| Wire Color | Pin on Strip |
| ---------- | ------------ |
| RED        | 5V Power     |
| WHITE      | Data (DIN)   |
| BLACK      | Ground (GND) |

> [!NOTE] 
> When soldering wires to the LED strip, ensure that you solder the 3-Wire connector to the input side of the LEDs. There is typically an arrow flowing from the LED before it to the next one. See the diagram below for the wiring guide and the arrows I'm referring to. They may be placed differently on your LED strips. 

![Basic (1)](https://gist.github.com/user-attachments/assets/c5660f60-b618-4596-beeb-47d6ecbff48f)


### Using a Logic Level Shifter with WS2812B LED strips
<sub><sup>(Please note that the following section should work both in theory and in practice, but I haven't tested it myself. Please comment below if you test this section so I can update any issues with it)</sub></sup>

> [!NOTE] 
> When soldering wires to the LED strip, ensure that you solder the side of the diode with the gray ring to the input side of the LEDs. There is typically an arrow flowing from the LED before it to the next one. See the diagram below for the wiring guide and the arrows I'm referring to. They may be placed differently on your LED strips. 

![74HCT125 Logic Level Shifter](https://gist.github.com/user-attachments/assets/8b7afd6d-750c-4bac-926b-9be7188e260c)


### Using a Diode setup with WS2812B LED strips (The Scuffed Solution)
<sub><sup>(Please note that the following section should work in theory, and in practice, but I haven't fully tested it myself. I've tested without the wire running to before the second LED. Please comment below if you test this section so I can update any issues with it)</sub></sup>

> [!NOTE] 
> When soldering wires to the LED strip, ensure that you solder the 1Y pin to the input side of the LEDs. There is typically an arrow flowing from the LED before it to the next one. See the diagram below for the wiring guide and the arrows I'm referring to. They may be placed differently on your LED strips. 

![Diode](https://gist.github.com/user-attachments/assets/97be1e79-e22d-4ae1-8774-d9a21a5e35cf)
***

## Why some WS2812B LED Strips _don't_ work.
All information in this section is taken from the [Adafruit WS2812B Datasheet.](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf)

If I properly understand the datasheet, WS2812B LEDs can take an input voltage from 3.5 volts to 5.3 volts. I'll ignore the current section of the datasheet since it doesn't really matter for us since PROS/VEXcode/The VEX Brain has a hard limit of 64 LEDs in one strip. 

VIH is the Input Voltage High cutoff. In laymans terms, it's the point above which a value will always read high. 
VIL is the Input Voltage Low Cutoff. It's the voltage where any value below it is guaranteed to read low. This doesn't particularly matter for us, since it's not the reason why the strips don't always work right.
VDD is the voltage from the power supply. For VEX 3-Wire ports, it's roughly 5 volts.

For WS2812B LEDs, Vih is `0.7*VDD`. That means it's `0.7*5`, which is `3.5 volts`. That means that the data voltage has to be above `3.5 Volts` to read as high. However, since VEX's data logic reads high at `3.3 volts`, the LEDs don't always read high. 

For a value to be guaranteed as low, it has to be `0.3*VDD`. `0.3*5` equals `1.5 volts`. In between 3.5 and 1.5 volts, there's a range where the value may or may not be _**reliably**_ read as high or low. It's possible that the more dense strips use the newer v5 revision of the WS2812B LED, which accept 2.7v and above as HIGH. 

![Three Wire Cable (2)](https://gist.github.com/user-attachments/assets/a4f3695a-3d28-48b2-a8b1-539e9bd9fcf8)

> [!NOTE]
> A Logic Level shifter is the optimal solution because it increases the logic HIGH to 5v, which allows the LEDs to reliably understand what the VEX Brain is trying to communicate. 

Using a rectifier diode can also fix this issue by reducing the Vcc voltage by ~0.7v, or reducing 5v down to 4.3v roughly. 
![Three Wire Cable (2)](https://gist.github.com/user-attachments/assets/4a05bb6c-a78a-4d65-bd9f-8a355d458fd9)
***
## Programming Guide
> [!NOTE]
> It's recommended to plug each seperate set of LEDs into it's own external ADI expander to avoid tripping the current limit of each smartport.

### PROS
```cpp
#define LED_PORT 'a'
#define SMART_PORT 1
#define LED_LENGTH 3

pros::Led led (LED_PORT, LED_LENGTH);
// or
pros::Led led ({SMART_PORT, LED_PORT}, LED_LENGTH);
```
Full documentation is available at [https://purduesigbots.github.io/pros-doxygen-docs/group__cpp-adi.html#ga940c125c457549717840ffd81acc2e5d](https://purduesigbots.github.io/pros-doxygen-docs/group__cpp-adi.html#ga940c125c457549717840ffd81acc2e5d)
***
### VEXcode
#### C++
Documentation for Addressable LED support in VEXcode C++ is limited, but JPearman did make a demo a few years back. [https://github.com/jpearman/V5_addr_led_demo/](https://github.com/jpearman/V5_addr_led_demo/)

To get started, you'll need to copy [vex_addrled.h](https://github.com/jpearman/V5_addr_led_demo/blob/master/include/vex_addrled.h) to your project, and include it in whatever file you'll be working in. Since documentation is limited, I've had ChatGPT write some documentation below to get started.
```cpp
/**
* Construct an addressable_led object
* @param port a vex::triport (smartport and adi combo) to connect to
* @param max the maximum amount of leds that will be in your strip. (64 is the absolute maximum supported by VEX)
*/
addressable_led( triport::port &port, int32_t max = MAX_LEDS );

/**
 * Clears the LED strip with the given color.
 * @param col The color to set all LEDs to (default is off).
 */
void clear(color col = color(0x000000));
 
 /**
 * Sets a range of LEDs to the provided color data.
 * @param pData Pointer to the color data array.
 * @param nOffset Starting LED index.
 * @param nLength Number of LEDs to update.
 * @param options Additional options for LED control.
 */
void set(uint32_t *pData, uint32_t nOffset, uint32_t nLength, uint32_t options);

/**
 * Sets all LEDs to a single color without flushing to hardware.
 * @param col The color to set all LEDs to.
 */
void set(color col = color(0x000000));

/**
 * Rotates the LED buffer by a given number of positions.
 * @param n Number of positions to rotate (positive for right, negative for left).
 */
void rotate(int n);

/**
 * Sends the current LED buffer to the hardware.
 */
void flush();

/**
 * Gets the maximum number of LEDs supported by this instance.
 * @return The maximum number of LEDs.
 */
int32_t max();
```
#### Python
Documentation for WS2812B LED strips for python is available at [https://api.vex.com/v5/home/python/AddressableLED.html](https://api.vex.com/v5/home/python/AddressableLED.html)


### LED Libraries
#### [Sylib](https://sylvie.fyi/sylib/docs/) (PROS & VEXcode)
I won't go into detail here since the documentation for setting up the LEDs is already available on [https://sylvie.fyi/sylib/docs/](https://sylvie.fyi/sylib/docs/), however Sylib is unique in that it supports both VEXcode and PROS.

#### [StormLib](https://github.com/ItzSt0rmz/StormLib/) (PROS)
I haven't tested this library, nor do I know if it actually works. But it does exist, and seems to have been updated recently as of writing this post, so I'll put it here. There is some limited documentation listed in the README, but your mileage may vary. The setup section is available at [https://github.com/ItzSt0rmz/StormLib#software](https://github.com/ItzSt0rmz/StormLib#software)

#### [LedLib](https://github.com/ABUCKY0/LedLib) (PROS)
I wrote an LED Library roughly a year ago, but it does have some weird issues with my LED strips. If you would like to update/fork it, open an issue on [https://github.com/ABUCKY0/LedLib](https://github.com/ABUCKY0/LedLib). I haven't written documentation for it, nor do I feel like writing documentation currently. Read [main.cpp](https://github.com/ABUCKY0/LedLib/blob/main/src/main.cpp) and [LedLib.hpp](https://github.com/ABUCKY0/LedLib/blob/main/include/LedLib/LedLib.hpp) to get an idea of the features available and how to use it.


If you have any additional libraries to list here, leave a comment below.

***
## Troubleshooting
### General Troubleshooting
- Check and make sure that the cable is fully seated inside the ADI connector of either the brain or the external ADI expander. The _white_ data cable should be facing the direction of the notch on the brain/ADI expander (AKA it should be on top).
- Ensure that your LED strips are wired as described in one of the above wiring sections depending on what setup you chose.
- Ensure that there are no errors in your code and the proper ADI port or port pair is selected in the LED constructor in PROS/VEXcode.
### Specific Troubleshooting
- **My LED strips light up but then shut off, and this repeats** - You're likely hitting the current limit of the internal or external ADI expander. Move any additional LED strips to a different ADI expander.
- **My LED strips are flickering or only a few LEDs are barely lighting up and shutting off, and I don't have a Logic Level Shifter or a Diode setup** - This is due to what was described in the section titled `Why some WS2812B LED Strips _don't_ work`. Aquire yourself some diodes or the 74HCT125 logic level shifter. 
- If you're using the diode setup and your LED strips aren't working, use a multimeter between GND and the PWR pin anywhere on the LED strip. If you don't see 4-5v power, then you either wired the diode the wrong direction or the 3-Wire connector isn't fully seated in the brain.