'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import Image from 'next/image';
import { useState } from 'react';

export default function AllesGute() {
  const [clickCount, setClickCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 250, left: 105 });

  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 60;

  const handleClick = () => {
    if (clickCount < 4) {
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;

      // eslint-disable-next-line sonarjs/pseudo-random
      const randomTop = Math.floor(Math.random() * maxTop);
      // eslint-disable-next-line sonarjs/pseudo-random
      const randomLeft = Math.floor(Math.random() * maxLeft);

      setPosition({ top: randomTop, left: randomLeft });
      setClickCount((prev) => prev + 1);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="f-col relative h-screen items-center gap-5 p-1">
      <Image
        src="/happy.jpg"
        height={400}
        width={600}
        alt="Happy Birthday!"
        className="motion-preset-slide-right-sm rounded-lg"
      />
      <div className="motion-preset-confetti">
        <h1 className="motion-preset-pop text-2xl font-bold">
          Alles Gute zum Geburtstag Sam!
        </h1>
      </div>

      <Button
        onClick={handleClick}
        size="lg"
        className="bg-gradient-to-tr from-green-400 to-blue-500 text-lg text-white transition-colors duration-300"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          cursor: 'pointer',
        }}
      >
        Überraschung! 🎉
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerTitle className="hidden">s</DrawerTitle>
          <div className="f-col motion-preset-confetti items-center gap-5 p-5">
            <h2 className="motion-preset-typewriter text-center text-2xl font-bold">
              🎉Sie sind der 1000. Besucher auf dieser Seite!🎉
            </h2>
            <Image
              src="/image.png"
              height={200}
              width={200}
              alt="Happy Birthday!"
              className="motion-preset-wobble"
            />
            <div className="f-col items-center gap-2">
              <h2 className="text-xl font-bold">
                Und sind der glückliche Gewinner von
              </h2>
              <span className="motion-preset-confetti text-2xl font-bold text-green-400 underline underline-offset-4">
                15€ in Solana!
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Und alles Gute (nachträglich) zum Geburtstag!
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
