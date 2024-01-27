# [multitroid](http://multitroid.com) web client
Super Metroid co-op frontend.

Find us on [Discord](https://discord.gg/yQmPm46).

<img src="src/images/ai/logo3.png" alt="multitroid logo" width="300">

## How it works

### Websockets
Each player goes to the webpage that this repository creates, and creates/joins a session. The webpage then makes a 
websocket to the multitroid server, and displays the session on the webpage. This websocket is only used to display 
state on the webpage, and not for actual playing.

The player gets a list of snes/emulators they can connect to. Another websocket is created to 
*each console* you connect to, and then another ws to the server *per console*.

To sum it up:
- Webpage <-ws-> Server
- Per console:
  - Console <-ws-> Webpage <-ws-> Server

### ROM patch
After this, the rom is patched automatically. If you need to see the contents of the patch, you can look in options
in the session. The contents of the patch might differ depending on ROM, and comes from the server.

### Reads and writes to the SNES
The webpage will run code in a loop for as long as the snes+server websockets are active 
(see [mainloop.js](src/snes/mainloop.js)):
- Read different kinds of data and send diff to the server. The reads have been optimized based on address/offset 
proximity. It is the server that decides what to read, and it depends on which ROM type was selected for the session.
- Check command queue (more on this below) for things to write to the SNES, and write them. This will put assembly 
code in SRAM, and will be run by the snes on the next game loop (not website loop). This can be slow depending on the amount of data, 
and will keep writing and waiting for the snes until all the commands have been written. Each set of commands waits
until the SNES has finished processing the previous set. Then the new set is sent to the SNES.
- Wait up to 250ms before looping, depending on how long the previous loop took

### Commands
This is really complicated, but basically boils down to ASM code that the SNES
can run to make it do what we want. It includes overflow protection, bit/byte manipulation, the works. The reason we 
let the SNES run the code is for consistency. It would be really bad if we write something the snes is currently using. 
This would lead to many crashes and half-written data. Instead we let the SNES execute the code inbetween its own game 
loops. 

Commands are received from the server. They are then put in the command queue and processed when the mainloop gets 
there. 

### Terminology and data types
- **Session details**: An object that contains information about the session and ROM. This is received when connecting 
to the server. Includes range/bit descriptors (see below), data for drawing the map, rom name, whether you can cheat, 
etc. 
- **Game state**: Where the player is in the game. Could be in the main menu, in an elevator, or on the death/continue 
screen.
- **Consumables**: Anything you can gain and use. Energy, reserve, missiles, supers, power bombs, etc.
- **Range**: This is a range of bytes that we read/write.
- **Range descriptor**: Describes what data is inside the range of bytes. Includes bit descriptors (see below).
- **Bit**: Smallest unit of data. Used for pretty much everything. Whether you have found varia suit is a single bit. 
- **Bit descriptor**: Describes what the bit does, and which index the bit has in its byte.

## Local development
```sh
npm install
npm start
```

This will run the application on [localhost port 8092](http://localhost:8092).

By default the web client will make sessions on [the running beta version](http://beta.multitroid.com) backend. 
If you need to run the client against a local/different backend, you can change the proxy URL in the bottom
of [webpack.dev.js](webpack.dev.js).

## Merging code
Create a Pull Request and let us know [on discord](https://discord.gg/yQmPm46) so we can look at it. Please make the PR
description as detailed as possible, and include images if relevant.

## Deployment
Deployment is not currently set up for the open source repo, so we'll handle it manually.
