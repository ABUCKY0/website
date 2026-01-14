---
title: 'The Fireman Discord Bot'
date: 2026-1-13
description: 'What is the Fireman Discord Bot?'
author: 'Astro Learner'
banner: /blog/fireman-bot/the-fireman-bot-banner.png
tags: ["discord", "bot", "discord bot"]
unlisted: true
---
# What is The Fireman?
The Fireman is an in-house moderation bot designed for the Minecraft RTX Discord Server that currently contains two features: A 'Firepit', and a slash command to give users image perms for the support channels. Both of these are anti-spam measures to reduce the number of scams that have recently been flooding the server. 

One of the common scams we see in the Minecraft RTX Discord that bypassed our automod rules were image scams. These contain usually either one or four photos of a screen, usually of a fake Twitter page or a crypto page. These usually contain steps to follow and a fake outcome from following the steps, and are only caught by Automod rules that block links and images for users who haven't had a full conversation in the server. (Tatsu handles this with our role ranking system). Our support channels weren't subject to this rank system because we wanted new users of BetterRTX to be able to send images to help diagnose issues with Minecraft or BetterRTX. 

The Fireman hopes to solve this problem with a two pronged approach: A firepit channel, which "kicks" anyone who sends a message here, and the `/permgrant` command. (The "kick" is actually technically an immediate ban and unban, which serves to delete messges by the user in the last hour.)

## Rules of the Firepit
1. Don't talk while watching the fire. Doing so results in you being burnt. 
2. Don't complain if you permanently killed while being burnt. (If the unban process fails, we aren't manually unbanning you.)
3. We count the number of people being burnt, and you will become a statistic if you talk. 

## The `/permgrant` Command
All the permgrant command does is give you the `Support Image Perms` role, which allows you to send images in the Support text channels. 

If you are providing another user support, you can give them image perms by inputting their Username into the `user:` box. 

If at any time the `/permgrant` command fails to work and you need to send images in the support channel, please ping the `@Moderator` role.

## The Fireman's Namesake
The Fireman is named after Ray Bradbury's book Farenheit 451. This was done because the purpose of the bot (to control and limit (albiet scammy) speech) reminded me of Guy Montag's job as a Fireman. In the book, the fireman go around burning houses down of people who were caught with books, and enforcing a ban of all books by burning them. 

It helps that our automod system does sometimes flag real messages, which sometimes blocks the spread of helpful knowlege. below is a recent example of a falsely flagged message.
![A Falsely Flagged Discord Message by our Automod System](/blog/fireman-bot/image.png)

## Scams

To the general public, it may appear that we don't really have any scams, and that this system isn't really needed. (I mean we did temporarily close off the support channels after only 4 scams bypassing automod in a two day period.) However, the mod-logs have seen upwards of 4-5 of these scams in a single day, and up until we blocked the support channels we saw 15-20 of these scams weekly in the mod-logs.

## Privacy
The Fireman currently does not store any user information or messages sent in the Minecraft RTX Discord server. The only information stored is a count of the number of users burnt by the Firepit.

This post will be updated if this changes in the future. However, the Minecraft RTX Discord Server is a public server, and does have a deleted messages log powered by [Carl Bot](https://carl.gg). You should never expect any message sent in any Discord server, public or private, to stay private.
