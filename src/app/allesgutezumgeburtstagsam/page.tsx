'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function AllesGute() {
  const [clickCount, setClickCount] = useState(0);
  const [position, setPosition] = useState({ top: 250, left: 106 });
  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 60;

  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadingIntervalRef = useRef<NodeJS.Timer | null>(null);

  const [showRetry, setShowRetry] = useState(false);
  const [retryClickCount, setRetryClickCount] = useState(0);
  const [retryPosition, setRetryPosition] = useState({ top: 300, left: 200 });

  const [showCups, setShowCups] = useState(false);
  const [hasSurpriseFlowed, setHasSurpriseFlowed] = useState(false);

  const [animateCups, setAnimateCups] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);

  // The user can attempt the cups up to 3 times
  // 1 -> if wrong, go to 2
  // 2 -> if wrong, go to 3
  // 3 -> if wrong => open modal
  const [attemptNumber, setAttemptNumber] = useState(1);

  // For attempt #2 and #3, pressing "Abbrechen" can stop an indefinite phase
  const hasPressedAbbrechenInThisRun = useRef(false);

  function clearLoadingInterval() {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }

  // Start the loading bar for the current attempt
  function startLoadingBar() {
    setProgress(0);
    hasPressedAbbrechenInThisRun.current = false;

    if (attemptNumber === 1) {
      runLoadingBarAttempt1();
    } else if (attemptNumber === 2) {
      runLoadingBarAttempt2();
    } else {
      runLoadingBarAttempt3();
    }
  }

  /***********
   * Attempt #1
   ***********/
  // - 0->99% over ~15s
  // - hold 99% for 10s
  // - show "Abbrechen"
  function runLoadingBarAttempt1() {
    const startTime = Date.now();
    let phase = 0; // 0 => climbing, 1 => holding
    loadingIntervalRef.current = setInterval(() => {
      const globalElapsed = (Date.now() - startTime) / 1000;

      if (phase === 0) {
        // climb 0->99% over ~15s
        if (globalElapsed < 15) {
          setProgress((prev) => {
            // about 99 / 15 ~ 6-7 increments each second
            return Math.min(prev + 6, 99);
          });
        } else {
          setProgress(99);
          phase = 1;
        }
      } else if (phase === 1) {
        // hold 99% for 10s
        const holdElapsed = globalElapsed - 15;
        if (holdElapsed < 10) {
          setProgress(99);
        } else {
          clearLoadingInterval();
          setProgress(99);
          setShowRetry(true);
        }
      }
    }, 1000);
  }

  /***********
   * Attempt #2
   ***********/
  // - 0->99% over ~15s
  // - hold 99% for 10s
  // - then climb 99->130+ at +5%/sec
  // - exactly at 130%, we show "Abbrechen"
  // - if user never presses Abbrechen, we keep going above 130
  function runLoadingBarAttempt2() {
    const startTime = Date.now();
    let phase = 0; // 0 => climb, 1 => hold, 2 => indefinite climb
    loadingIntervalRef.current = setInterval(() => {
      const globalElapsed = (Date.now() - startTime) / 1000;

      switch (phase) {
        case 0: {
          // 0->99% over 15s
          if (globalElapsed < 15) {
            setProgress((prev) => Math.min(prev + 6, 99));
          } else {
            setProgress(99);
            phase = 1;
          }

          break;
        }
        case 1: {
          // hold 99 for 10s
          const holdElapsed = globalElapsed - 15;
          if (holdElapsed < 10) {
            setProgress(99);
          } else {
            phase = 2;
          }

          break;
        }
        case 2: {
          // indefinite climb from 99 upward
          if (hasPressedAbbrechenInThisRun.current) {
            clearLoadingInterval();
            setShowRetry(true);
          } else {
            // +5% each second
            setProgress((prev) => {
              const nextVal = prev + 5;
              // once we cross 130, we show Retry if not already shown
              if (nextVal >= 130 && !showRetry) {
                setShowRetry(true);
              }
              return nextVal;
            });
          }

          break;
        }
        // No default
      }
    }, 1000);
  }

  /***********
   * Attempt #3
   ***********/
  // - 0->99% over 15s
  // - hold 99 for 10s
  // - drop 99->0 over 10s
  // - then keep dropping 0->-10, -15... until Abbrechen is pressed
  // - at -10, show "Abbrechen"
  function runLoadingBarAttempt3() {
    const startTime = Date.now();
    let phase = 0; // 0 => climb, 1 => hold, 2 => drop 99->0, 3 => indefinite negative
    let phaseStart = Date.now();
    loadingIntervalRef.current = setInterval(() => {
      const globalElapsed = (Date.now() - startTime) / 1000;

      switch (phase) {
        case 0: {
          // climb 0->99 over 15s
          if (globalElapsed < 15) {
            setProgress((prev) => Math.min(prev + 6, 99));
          } else {
            setProgress(99);
            phase = 1;
            phaseStart = Date.now();
          }

          break;
        }
        case 1: {
          // hold 99 for 10s
          const holdElapsed = (Date.now() - phaseStart) / 1000;
          if (holdElapsed < 10) {
            setProgress(99);
          } else {
            phase = 2;
            phaseStart = Date.now();
          }

          break;
        }
        case 2: {
          // 99->0 over 10s
          const dropElapsed = (Date.now() - phaseStart) / 1000; // 0..10
          if (dropElapsed < 10) {
            // linear approach: each second => -10
            // total drop 99 over 10s => ~10 each second
            const fraction = dropElapsed / 10; // 0..1
            const newVal = Math.floor(99 * (1 - fraction));
            setProgress(newVal);
          } else {
            setProgress(0);
            phase = 3;
            phaseStart = Date.now();
          }

          break;
        }
        case 3: {
          if (hasPressedAbbrechenInThisRun.current) {
            clearLoadingInterval();
            setShowRetry(true);
          } else {
            // keep dropping below 0, e.g. -5 each second
            setProgress((prev) => {
              const nextVal = prev - 5;
              // once we cross -10, show Retry if not already
              if (nextVal <= -10 && !showRetry) {
                setShowRetry(true);
              }
              return nextVal;
            });
          }

          break;
        }
        // No default
      }
    }, 1000);
  }

  // Reset everything for the next attempt
  function resetForNextAttempt() {
    setShowCups(false);
    setShowRetry(false);
    setRetryClickCount(0);
    setShowLoadingBar(true);
    setProgress(0);
    startLoadingBar();
  }

  function handleClickMainButton() {
    if (clickCount < 9) {
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;
      const randomTop = Math.floor(Math.random() * maxTop);
      const randomLeft = Math.floor(Math.random() * maxLeft);
      setPosition({ top: randomTop, left: randomLeft });
      setClickCount((prev) => prev + 1);
    } else if (!showLoadingBar) {
      setShowLoadingBar(true);
      startLoadingBar();
    }
  }

  function handleRetryClick() {
    // For attempt 2 & 3, pressing Abbrechen once stops the indefinite
    if (
      !hasPressedAbbrechenInThisRun.current &&
      (attemptNumber === 2 || attemptNumber === 3)
    ) {
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
      setShowLoadingBar(false);
      setShowRetry(false);
      setShowCups(true);
    }
  }

  function handleSurpriseTextClick() {
    setHasSurpriseFlowed(true);
    setTimeout(() => {
      setAnimateCups(true);
      setTimeout(() => {
        // after 6s, done
      }, 6000);
    }, 800);
  }

  function handleGuess() {
    if (attemptNumber < 3) {
      setAttemptNumber((prev) => prev + 1);
      setErrorMsg('Nope! Das ist falsch.');
      setTimeout(() => {
        setErrorMsg('');
        setAnimateCups(false);
        setHasSurpriseFlowed(false);
        resetForNextAttempt();
      }, 1500);
    } else {
      // 3rd => open final modal
      setOpen(true);
    }
  }

  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full p-1">
      <div className="relative z-0 flex flex-col items-center gap-3 pt-5">
        <Image
          src="/happy.jpg"
          height={400}
          width={600}
          alt="Happy Birthday!"
          className="motion-preset-slide-right-sm rounded-lg"
        />
        <div className="motion-preset-confetti">
          <h1
            className="motion-preset-pop text-2xl font-bold"
            style={{ zIndex: 1 }}
          >
            Alles Gute zum Geburtstag, Sam!
          </h1>
        </div>
      </div>

      {!showLoadingBar && !showCups && (
        <Button
          onClick={handleClickMainButton}
          size="lg"
          className="bg-gradient-to-tr from-green-400 to-blue-500 text-lg text-white transition-colors duration-300"
          style={{
            position: 'absolute',
            zIndex: 10,
            top: position.top,
            left: position.left,
            cursor: 'pointer',
          }}
        >
          Überraschung! 🎉
        </Button>
      )}

      {showLoadingBar && (
        <div className="absolute left-1/2 top-[30%] z-20 w-[80%] max-w-xl -translate-x-1/2 rounded p-2 shadow-md">
          <p className="mb-2 text-center font-bold">
            Bitte warten... ({progress}%)
          </p>
          <div className="relative h-4 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-4 bg-green-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
                minWidth: progress < 0 ? Math.abs(progress) + '%' : '0%',
              }}
            />
          </div>
        </div>
      )}

      {showRetry && (
        <Button
          onClick={handleRetryClick}
          className="absolute z-[30] bg-red-500 text-white"
          style={{ top: retryPosition.top, left: retryPosition.left }}
        >
          Abbrechen
        </Button>
      )}

      {showCups && (
        <div className="f-col z-30 w-full items-center justify-center gap-5 pt-5">
          <h2 className="text-center text-lg font-semibold">
            In einem der Becher ist ein Geschenk versteckt. Wähle weise!
          </h2>
          <div
            className="cups-container relative h-[120px]"
            style={{ width: '600px' }}
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
            {!hasSurpriseFlowed && (
              <Button className="mt-10" onClick={handleSurpriseTextClick}>
                Her damit!
              </Button>
            )}
          </div>

          {errorMsg && (
            <p className="font-bold text-red-500" style={{ marginTop: '1rem' }}>
              {errorMsg}
            </p>
          )}
        </div>
      )}

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
          left: 200px;
        }
        .cup3 {
          left: 400px;
        }

        /* 6 swaps in 6 seconds, purely horizontal.
           Each ~16.66% is one swap step. 
           Cup1 ends at left=0, Cup2 ends at 200, Cup3 ends at 400. */

        .cup1-anim {
          animation: cup1Move 6s forwards;
        }
        @keyframes cup1Move {
          0% {
            left: 0;
          }
          16.66% {
            left: 200px;
          }
          33.33% {
            left: 200px;
          }
          50% {
            left: 0;
          }
          66.66% {
            left: 200px;
          }
          83.33% {
            left: 200px;
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
            left: 200px;
          }
          16.66% {
            left: 0;
          }
          33.33% {
            left: 400px;
          }
          50% {
            left: 400px;
          }
          66.66% {
            left: 0;
          }
          83.33% {
            left: 400px;
          }
          100% {
            left: 400px;
          }
        }

        .cup3-anim {
          animation: cup3Move 6s forwards;
        }
        @keyframes cup3Move {
          0% {
            left: 400px;
          }
          16.66% {
            left: 400px;
          }
          33.33% {
            left: 200px;
          }
          50% {
            left: 200px;
          }
          66.66% {
            left: 400px;
          }
          83.33% {
            left: 0;
          }
          100% {
            left: 200px;
          }
        }
      `}</style>
    </div>
  );
}
