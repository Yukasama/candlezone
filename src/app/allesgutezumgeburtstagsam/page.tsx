'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function AllesGute() {
  // -----------------------------------------------------
  // 1) Main button click logic
  // -----------------------------------------------------
  const [clickCount, setClickCount] = useState(0);
  const [position, setPosition] = useState({ top: 250, left: 106 });
  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 60;

  // -----------------------------------------------------
  // 2) Loading bar states & intervals
  // -----------------------------------------------------
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadingIntervalRef = useRef<NodeJS.Timer | null>(null);

  // -----------------------------------------------------
  // 3) Retry button logic
  // -----------------------------------------------------
  const [showRetry, setShowRetry] = useState(false);
  const [retryClickCount, setRetryClickCount] = useState(0);
  const [retryPosition, setRetryPosition] = useState({ top: 300, left: 200 });

  // -----------------------------------------------------
  // 4) Cups & "Surprise" text
  // -----------------------------------------------------
  const [showCups, setShowCups] = useState(false);
  const [hasSurpriseFlowed, setHasSurpriseFlowed] = useState(false);

  // Triggers the 3-second animation (cup swaps in sequence)
  const [animateCups, setAnimateCups] = useState(false);
  // eslint-disable-next-line sonarjs/no-unused-vars, sonarjs/no-dead-store, @typescript-eslint/no-unused-vars
  const [cupsShuffled, setCupsShuffled] = useState(false);

  // We'll track how many guesses have been made (1–4)
  const [guesses, setGuesses] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // -----------------------------------------------------
  // 5) Final Drawer/Modal
  // -----------------------------------------------------
  const [open, setOpen] = useState(false);

  // -----------------------------------------------------
  // Main "Überraschung" button (click up to 9 times)
  // -----------------------------------------------------
  const handleClickMainButton = () => {
    if (clickCount < 9) {
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;
      // eslint-disable-next-line sonarjs/pseudo-random
      const randomTop = Math.floor(Math.random() * maxTop);
      // eslint-disable-next-line sonarjs/pseudo-random
      const randomLeft = Math.floor(Math.random() * maxLeft);
      setPosition({ top: randomTop, left: randomLeft });
      setClickCount((prev) => prev + 1);
    } else if (!showLoadingBar) {
      setShowLoadingBar(true);
      startLoadingBar();
    }
  };

  const startLoadingBar = () => {
    const startTime = Date.now();
    loadingIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed < 20) {
        setProgress((prev) => {
          // eslint-disable-next-line sonarjs/pseudo-random
          const increment = Math.floor(Math.random() * 8);
          const nextVal = prev + increment;
          return nextVal >= 99 ? 98 : nextVal;
        });
      } else if (elapsed >= 20 && elapsed < 30) {
        setProgress(99);
      } else {
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current as NodeJS.Timeout);
        }
        setProgress(99);
        setShowRetry(true);
      }
    }, 1000);
  };

  // -----------------------------------------------------
  // Retry button (6 jumps), then show cups
  // -----------------------------------------------------
  const handleRetryClick = () => {
    if (retryClickCount < 6) {
      const maxTop = window.innerHeight - BUTTON_HEIGHT;
      const maxLeft = window.innerWidth - BUTTON_WIDTH;
      // eslint-disable-next-line sonarjs/pseudo-random
      const randomTop = Math.floor(Math.random() * maxTop);
      // eslint-disable-next-line sonarjs/pseudo-random
      const randomLeft = Math.floor(Math.random() * maxLeft);
      setRetryPosition({ top: randomTop, left: randomLeft });
      setRetryClickCount((prev) => prev + 1);
    } else {
      setShowLoadingBar(false);
      setShowRetry(false);
      setShowCups(true);
    }
  };

  // -----------------------------------------------------
  // "Surprise" text flows into the middle cup (#2)
  // then triggers the 3s, step-by-step swap animation.
  // -----------------------------------------------------
  const handleSurpriseTextClick = () => {
    setHasSurpriseFlowed(true);

    // Give it ~0.8s to visually "flow in"
    setTimeout(() => {
      // Now trigger the actual 3s shuffle animation
      setAnimateCups(true);

      // We'll mark them as "shuffled" at the end of 3s
      setTimeout(() => {
        setCupsShuffled(true);
      }, 3000);
    }, 800);
  };

  // -----------------------------------------------------
  // Guess logic:
  //  - first 3 guesses => always wrong
  //  - 4th => open modal
  // -----------------------------------------------------
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);

  const handleGuess = () => {
    setGuesses((prev) => prev + 1);

    if (guesses < 3) {
      setErrorMsg('Nope! Das ist falsch.');
      setShowTryAgainButton(true);
    } else {
      // on 4th guess => open modal
      setOpen(true);
    }
  };

  // -----------------------------------------------------
  // "Try Again" => remove error message
  // and RE-RUN the 3s cup animation from the beginning
  // -----------------------------------------------------
  const handleTryAgain = () => {
    setErrorMsg('');
    setShowTryAgainButton(false);

    // Reset the "forwards" state of the cups:
    setAnimateCups(false);
    setCupsShuffled(false);

    // Wait a tick so the DOM reverts the cups to initial positions
    // then trigger the animation again
    setTimeout(() => {
      setAnimateCups(true);
      // End again after 3s
      setTimeout(() => {
        setCupsShuffled(true);
      }, 3000);
    }, 100);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  // -----------------------------------------------------
  // Rendering
  // -----------------------------------------------------
  return (
    <div className="f-col relative h-screen items-center gap-5 p-1">
      {/* Image + Title */}
      <Image
        src="/happy.jpg"
        height={400}
        width={600}
        alt="Happy Birthday!"
        className="motion-preset-slide-right-sm rounded-lg"
      />
      <div className="motion-preset-confetti">
        <h1 className="motion-preset-pop text-2xl font-bold">
          Alles Gute zum Geburtstag, Sam!
        </h1>
      </div>

      {/* MAIN BUTTON (until loading starts) */}
      {!showLoadingBar && !showCups && (
        <Button
          onClick={handleClickMainButton}
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
      )}

      {/* LOADING BAR */}
      {showLoadingBar && (
        <div className="w-[80%] max-w-xl rounded border border-gray-300 p-2 shadow-md">
          <p className="mb-2 text-center font-bold">Bitte warten...</p>
          <div className="relative h-4 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-4 bg-green-500 transition-all duration-500"
              style={{ width: `${progress.toString()}%` }}
            />
          </div>
        </div>
      )}

      {/* RETRY BUTTON */}
      {showRetry && (
        <Button
          onClick={handleRetryClick}
          className="bg-red-500 text-white"
          style={{
            position: 'absolute',
            top: retryPosition.top,
            left: retryPosition.left,
            cursor: 'pointer',
          }}
        >
          Abbrechen
        </Button>
      )}

      {/* STEP: CUPS & SURPRISE */}
      {showCups && (
        <div className="relative mt-10 flex flex-col items-center gap-5">
          {/* Error message (if guess is wrong) */}
          {errorMsg && <p className="font-bold text-red-500">{errorMsg}</p>}

          {/*
            We'll have a container .cups-container of a fixed width/height
            The base classes .cup1, .cup2, .cup3 put them side by side from the start
          */}
          <div
            className="cups-container relative"
            style={{
              width: '400px', // enough space for all 3 cups
              height: '120px',
            }}
          >
            {/* CUP #1 */}
            <button
              onClick={handleGuess}
              className={`cup1 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-yellow-200 ${
                animateCups ? 'cup1-anim' : ''
              }`}
            >
              <p className="mb-2">Cup 1</p>
            </button>

            <button
              onClick={handleGuess}
              className={`cup2 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-yellow-200 ${
                animateCups ? 'cup2-anim' : ''
              }`}
            >
              <p className="mb-2">Cup 2</p>
            </button>

            <button
              onClick={handleGuess}
              className={`cup3 flex h-24 w-16 cursor-pointer items-end justify-center rounded-md bg-yellow-200 ${
                animateCups ? 'cup3-anim' : ''
              }`}
            >
              <p className="mb-2">Cup 3</p>
            </button>

            {!hasSurpriseFlowed && (
              <button
                onClick={handleSurpriseTextClick}
                className="absolute cursor-pointer text-lg text-blue-600 underline"
                style={{
                  top: '5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'transform 0.8s ease, opacity 0.8s ease',
                }}
              >
                Überraschung🎉
              </button>
            )}
            {hasSurpriseFlowed && (
              <p
                className="absolute text-lg text-blue-600"
                style={{
                  top: '3.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: 0,
                  transition: 'opacity 0.8s ease',
                }}
              >
                Überraschung🎉
              </p>
            )}
          </div>

          {/* If the user guessed and was wrong, show "Erneut versuchen" */}
          {showTryAgainButton && (
            <Button onClick={handleTryAgain} className="bg-gray-500 text-white">
              Erneut versuchen
            </Button>
          )}
        </div>
      )}

      {/* FINAL DRAWER (MODAL) - only opens after 4th guess */}
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

      {/*
        GLOBAL STYLES:
        1) Base classes to position cups side-by-side from the start
        2) "-anim" classes that define the 3s step-by-step swap
      */}
      <style jsx global>{`
        /* Base positions (side by side from the start) */
        .cup1 {
          position: absolute;
          top: 0;
          left: 0;
        }
        .cup2 {
          position: absolute;
          top: 0;
          left: 120px;
        }
        .cup3 {
          position: absolute;
          top: 0;
          left: 240px;
        }

        /* The same step-by-step animation:
            0–33%: Cup #2 <-> Cup #3
            33–66%: Cup #3 <-> Cup #1
            66–100%: Cup #2 <-> Cup #1
        */

        .cup1-anim {
          animation: cup1Move 3s forwards;
        }
        @keyframes cup1Move {
          0% {
            left: 0;
          }
          33% {
            left: 0; /* Cup #1 stands still in first swap */
          }
          66% {
            left: 120px; /* Swap with Cup #3 (which is at 120) */
          }
          100% {
            left: 240px; /* Finally swaps with Cup #2 (which ends up at 120) */
          }
        }

        .cup2-anim {
          animation: cup2Move 3s forwards;
        }
        @keyframes cup2Move {
          0% {
            left: 120px;
          }
          33% {
            left: 240px; /* Cup #2 <-> Cup #3 */
          }
          66% {
            left: 240px; /* Stays put in second swap */
          }
          100% {
            left: 120px; /* Cup #2 <-> Cup #1 in final swap */
          }
        }

        .cup3-anim {
          animation: cup3Move 3s forwards;
        }
        @keyframes cup3Move {
          0% {
            left: 240px;
          }
          33% {
            left: 120px; /* Cup #3 <-> Cup #2 */
          }
          66% {
            left: 0; /* Cup #3 <-> Cup #1 */
          }
          100% {
            left: 0; /* Stays at 0 after final swap */
          }
        }
      `}</style>
    </div>
  );
}
