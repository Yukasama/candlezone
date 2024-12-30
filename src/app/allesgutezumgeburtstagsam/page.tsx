// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/pseudo-random */

'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function AllesGute() {
  // Track how many times user presses the main “Überraschung!” button
  const [clickCount, setClickCount] = useState(0);

  // Main “Überraschung!” button random positioning
  const [position, setPosition] = useState({ top: 250, left: 106 });
  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 60;

  // Attempt number for cups
  //  1 => If guess wrong => attempt=2 => re-run loading => cups
  //  2 => If guess wrong => attempt=3 => re-run loading => cups
  //  3 => If guess wrong => final modal
  const [attemptNumber, setAttemptNumber] = useState(1);

  // Show/hide loading bar
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Show/hide “Abbrechen” button
  const [showRetry, setShowRetry] = useState(false);
  const [retryClickCount, setRetryClickCount] = useState(0);
  const [retryPosition, setRetryPosition] = useState({ top: 400, left: 200 });

  // “Indefinite” portion logic for attempts #2 or #3
  const hasPressedAbbrechenInThisRun = useRef(false);

  // Show/hide cups, track if surprise has flowed, track if they animate
  const [showCups, setShowCups] = useState(false);
  const [hasSurpriseFlowed, setHasSurpriseFlowed] = useState(false);
  const [animateCups, setAnimateCups] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Final modal
  const [open, setOpen] = useState(false);

  // Helper to clear old intervals
  function clearIntervalIfNeeded() {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      // eslint-disable-next-line unicorn/no-null
      loadingIntervalRef.current = null;
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // 1) Main Button “Überraschung!” Logic
  /////////////////////////////////////////////////////////////////////////////
  function handleClickMainButton() {
    if (clickCount < 9) {
      // Jump to random position
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;
      const randomTop = Math.floor(Math.random() * maxTop);
      const randomLeft = Math.floor(Math.random() * maxLeft);
      setPosition({ top: randomTop, left: randomLeft });
      setClickCount((prev) => prev + 1);
    } else {
      // On the 10th press => show the loading bar (Attempt #1)
      setClickCount((prev) => prev + 1); // increment from 9->10
      startLoadingForAttempt(1);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // 2) Loading Bar Flow
  /////////////////////////////////////////////////////////////////////////////
  function startLoadingForAttempt(attempt: number) {
    setShowLoadingBar(true);
    setShowRetry(false);
    setProgress(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    retryClickCount && setRetryClickCount(0);
    hasPressedAbbrechenInThisRun.current = false;

    switch (attempt) {
      case 1: {
        runLoadingBarAttempt1();
        break;
      }
      case 2: {
        runLoadingBarAttempt2();
        break;
      }
      case 3: {
        runLoadingBarAttempt3();
        break;
      }
    }
  }

  // Attempt #1: 0->99 in 15s, hold 10s, show “Abbrechen”
  function runLoadingBarAttempt1() {
    clearIntervalIfNeeded();
    let phase = 0;
    const startTime = Date.now();

    loadingIntervalRef.current = setInterval(() => {
      const t = (Date.now() - startTime) / 1000;
      if (phase === 0) {
        if (t < 30) {
          setProgress((prev) => Math.min(prev + 6, 99));
        } else {
          setProgress(99);
          phase = 1;
        }
      } else if (phase === 1) {
        const holdT = t - 10;
        if (holdT < 30) {
          setProgress(99);
        } else {
          clearIntervalIfNeeded();
          setProgress(99);
          setShowRetry(true);
        }
      }
    }, 1000);
  }

  // Attempt #2: 0->99 in 15s, hold 10s, indefinite climb at +5%/sec
  // Once crosses 130 => show “Abbrechen”
  function runLoadingBarAttempt2() {
    clearIntervalIfNeeded();
    let phase = 0;
    const startTime = Date.now();

    loadingIntervalRef.current = setInterval(() => {
      const t = (Date.now() - startTime) / 1000;

      switch (phase) {
        case 0: {
          // climb 0->99 in 15s
          if (t < 30) {
            setProgress((prev) => Math.min(prev + Math.random() * 8, 99));
          } else {
            setProgress(99.9999999999);
            phase = 1;
          }
          break;
        }
        case 1: {
          // hold 99 for 10s
          const holdT = t - 10;
          if (holdT < 30) {
            setProgress(99.9999999999);
          } else {
            phase = 2;
          }
          break;
        }
        case 2: {
          // indefinite climb
          if (hasPressedAbbrechenInThisRun.current) {
            clearIntervalIfNeeded();
            setShowRetry(true);
          } else {
            setProgress((prev) => {
              const nextVal = prev + Math.random() * 5;
              if (nextVal >= 120 && !showRetry) {
                setShowRetry(true);
              }
              return nextVal;
            });
          }
          break;
        }
      }
    }, 1000);
  }

  // Attempt #3: 0->99 in 15s, hold 10s, 99->0 over 10s, indefinite negative
  // once < -10 => show “Abbrechen”
  function runLoadingBarAttempt3() {
    clearIntervalIfNeeded();
    let phase = 0;
    const startTime = Date.now();
    let phaseStart = Date.now();

    loadingIntervalRef.current = setInterval(() => {
      const globalT = (Date.now() - startTime) / 1000;

      switch (phase) {
        case 0: {
          // 0->99 in 15s
          if (globalT < 30) {
            setProgress((prev) => Math.min(prev + Math.random() * 8, 99));
          } else {
            setProgress(99.2646465776);
            phase = 1;
            phaseStart = Date.now();
          }
          break;
        }
        case 1: {
          // hold 99 for 10s
          const holdT = (Date.now() - phaseStart) / 1000;
          if (holdT < 30) {
            setProgress(99.9999999999);
          } else {
            phase = 2;
            phaseStart = Date.now();
          }
          break;
        }
        case 2: {
          // 99->0 over 10s
          const dropT = (Date.now() - phaseStart) / 1000;
          if (dropT < 20) {
            const fraction = dropT / 20.538753;
            const newVal = 99.99999999 * (1 - fraction);
            setProgress(newVal);
          } else {
            setProgress(0);
            phase = 3;
          }
          break;
        }
        case 3: {
          // indefinite negative
          if (hasPressedAbbrechenInThisRun.current) {
            clearIntervalIfNeeded();
            setShowRetry(true);
          } else {
            setProgress((prev) => {
              const nextVal = prev - Math.random() * 5;
              if (nextVal <= -15 && !showRetry) {
                setShowRetry(true);
              }
              return nextVal;
            });
          }
          break;
        }
      }
    }, 1000);
  }

  /////////////////////////////////////////////////////////////////////////////
  // 3) “Abbrechen” (Retry) Button, pressed up to 6 times
  /////////////////////////////////////////////////////////////////////////////
  function handleRetryClick() {
    if (!hasPressedAbbrechenInThisRun.current && attemptNumber >= 2) {
      hasPressedAbbrechenInThisRun.current = true;
    }
    if (retryClickCount < 6) {
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;
      const randomTop = Math.floor(Math.random() * maxTop);
      const randomLeft = Math.floor(Math.random() * maxLeft);
      setRetryPosition({ top: randomTop, left: randomLeft });
      setRetryClickCount((prev) => prev + 1);
    } else {
      // after 6 clicks => hide loading bar, show cups
      setShowLoadingBar(false);
      setShowRetry(false);
      setHasSurpriseFlowed(false);
      setShowCups(true);
      setProgress(0);
      setRetryClickCount(0);
      hasPressedAbbrechenInThisRun.current = false;
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // 4) Cup Guessing
  /////////////////////////////////////////////////////////////////////////////
  function handleGuess() {
    if (attemptNumber < 3) {
      // If guess is wrong => move to next attempt
      setErrorMsg('Das ist leider nicht richtig. :(');
      setTimeout(() => {
        setErrorMsg('');
        setShowCups(false);
        setAttemptNumber((prev) => prev + 1);
        startLoadingForAttempt(attemptNumber + 1);
      }, 1500);
    } else {
      // Attempt #3 => if guess is wrong => show final modal
      setOpen(true);
    }
  }

  function handleSurpriseClick() {
    setHasSurpriseFlowed(true);
    setTimeout(() => {
      setAnimateCups(true);
      setTimeout(() => {
        setAnimateCups(false);
      }, 6000);
    }, 800);
  }

  /////////////////////////////////////////////////////////////////////////////
  // 5) Cleanup if unmounted
  /////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    return () => {
      clearIntervalIfNeeded();
    };
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  // RENDER
  /////////////////////////////////////////////////////////////////////////////
  return (
    <div className="relative min-h-screen w-full p-1">
      {/* Birthday image + heading is visible from the start */}
      <div className="flex flex-col items-center justify-center gap-3 pt-5">
        <Image
          src="/happy.jpg"
          height={400}
          width={600}
          alt="Happy Birthday!"
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold">Alles Gute zum Geburtstag, Sam!</h1>
      </div>

      {/* Main “Überraschung!” button that jumps around up to 10 times */}
      {!showLoadingBar && !showCups && (
        <Button
          onClick={handleClickMainButton}
          className="bg-gradient-to-tr from-green-400 to-blue-500 text-white"
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            zIndex: 999,
          }}
        >
          Überraschung! 🎉
        </Button>
      )}

      {showLoadingBar && (
        <div
          className="absolute left-1/2 top-[32%] w-[80%] max-w-xl -translate-x-1/2 rounded p-2 shadow-md"
          style={{ overflow: 'visible' }}
        >
          <p className="mb-2 text-center font-bold">
            Bitte warten... ({progress}%)
          </p>
          <div
            className="relative h-4 w-full bg-gray-200"
            style={{
              /* crucial to see the bar outside normal bounds */
              overflow: 'visible',
            }}
          >
            <div
              className="absolute h-4 bg-green-500 transition-all duration-500"
              style={{
                ...(progress < 0
                  ? {
                      // If negative, shift `left` to the negative position,
                      // use the absolute value for the width
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      left: `${progress}%`,
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      width: `${-progress}%`,
                    }
                  : {
                      // If >= 0, anchor bar at left=0, let width exceed 100
                      left: '0%',
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      width: `${progress}%`,
                    }),
              }}
            />
          </div>
        </div>
      )}

      {/* “Abbrechen” (Retry) button, up to 6 clicks */}
      {showRetry && (
        <Button
          onClick={handleRetryClick}
          variant="destructive"
          className="absolute"
          style={{
            top: retryPosition.top,
            left: retryPosition.left,
          }}
        >
          Abbrechen
        </Button>
      )}

      {/* Show cups only after finishing loading + 6 “Abbrechen” in each attempt */}
      {showCups && (
        <div className="relative z-0 mt-10 flex flex-col items-center gap-5 p-5">
          <h2 className="text-center text-lg font-semibold">
            In einem der Becher ist ein Geschenk versteckt. Wähle weise!
          </h2>
          <div
            className={cn(
              'relative h-[120px]',
              (!hasSurpriseFlowed || animateCups) && 'pointer-events-none',
            )}
            style={{ width: '425px' }}
          >
            <button
              onClick={handleGuess}
              className={`cup1 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-red-300 ${
                animateCups ? 'cup1-anim' : ''
              }`}
            />
            <button
              onClick={handleGuess}
              className={`cup2 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-red-300 ${
                animateCups ? 'cup2-anim' : ''
              }`}
            />
            <button
              onClick={handleGuess}
              className={`cup3 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-red-300 ${
                animateCups ? 'cup3-anim' : ''
              }`}
            />
          </div>
          {!hasSurpriseFlowed && attemptNumber <= 3 && (
            <Button onClick={handleSurpriseClick}>Her damit!</Button>
          )}
          {errorMsg && (
            <p className="font-bold text-red-500" style={{ marginTop: '1rem' }}>
              {errorMsg}
            </p>
          )}
        </div>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerTitle className="hidden">
            Alles gute zum Geburtstag
          </DrawerTitle>
          <div className="f-col motion-preset-confetti items-center gap-5 p-5">
            <h2 className="text-center text-2xl font-bold">
              🎉 Herzlichen Glückwunsch. Sie sind der 1000ste Besucher auf
              dieser Seite! 🎉
            </h2>
            <Image
              src="/image.png"
              className="motion-preset-wobble"
              height={200}
              width={200}
              alt="Happy Birthday!"
            />
            <div className="f-col items-center gap-2">
              <h2 className="text-xl font-bold">
                Und sind der glückliche Gewinner von
              </h2>
              <span className="text-2xl font-bold text-green-400 underline underline-offset-4">
                15€ in Solana!
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Und alles Gute (nachträglich) zum Geburtstag!
            </p>
          </div>
        </DrawerContent>
      </Drawer>

      <style jsx global>{`
        .cup1,
        .cup2,
        .cup3 {
          position: absolute;
          top: 0;
        }
        .cup1 {
          left: 0;
        }
        .cup2 {
          left: 150px;
        }
        .cup3 {
          left: 300px;
        }

        .cup1-anim {
          animation: cup1Move 6s forwards;
        }
        @keyframes cup1Move {
          0% {
            left: 0;
          }
          16.66% {
            left: 0;
          }
          33.33% {
            left: 150px;
          }
          50% {
            left: 0;
          }
          66.66% {
            left: 150px;
          }
          83.33% {
            left: 150px;
          }
          100% {
            left: 0;
          }
        }

        .cup2-anim {
          animation: cup2Move 6s forwards;
        }
        @keyframes cup2Move {
          0% {
            left: 150px;
          }
          16.66% {
            left: 300px;
          }
          33.33% {
            left: 300px;
          }
          50% {
            left: 300px;
          }
          66.66% {
            left: 0;
          }
          83.33% {
            left: 300px;
          }
          100% {
            left: 300px;
          }
        }

        .cup3-anim {
          animation: cup3Move 6s forwards;
        }
        @keyframes cup3Move {
          0% {
            left: 300px;
          }
          16.66% {
            left: 150px;
          }
          33.33% {
            left: 0;
          }
          50% {
            left: 150px;
          }
          66.66% {
            left: 300px;
          }
          83.33% {
            left: 0;
          }
          100% {
            left: 150px;
          }
        }
      `}</style>
    </div>
  );
}
