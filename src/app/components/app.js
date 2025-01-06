"use client";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Nav_bar from "./nav-bar";

import React from "react";
import { Toaster } from "react-hot-toast";
import AudioPlayer from "./audioPlayer";
import { TrackManagerProvider } from "../context/TrackManagerContext";
import { FavoriteTracksProvider } from "../context/FavoriteTracksContext";
import { useState } from "react";
import TrackListQueue from "./TrackListQueue/TrackListQueue";
import { TrackListProvider } from "../context/TrackListContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { DeletedTracksProvider } from "../context/deletedTracksContext";
import Head from "next/head";
import { Menu } from "lucide-react";


import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const DrawerModal = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
  <>
    <Button className="sm:hidden text-pink" isIconOnly variant="light" onPress={onOpen}><Menu /></Button>
    
    <Drawer className="text-pink w-max bg-transparent" classNames={{"closeButton": "text-pink z-10"}} placement="left" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerBody className="w-max p-0">
              <Sidebar className="z-0" classNames={{"logo": "mr-8"}}/>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
    </>
  );
};

// nextui
export default function App({ children }) {
  const [showQueue, setShowQueue] = useState(false);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/shooting_stars.css" />
        <link rel="stylesheet" href="/css/home.css" />
      </Head>
      <DeletedTracksProvider>
        <FavoriteTracksProvider>
          <TrackListProvider>
            <TrackManagerProvider>
              <PlaybackProvider>
                <div id="App" className="h-screen">
                  <Toaster position="bottom-center" />
                  <Sidebar className="fixed left-0 top-0 z-40 h-full !w-64 -translate-x-full transition-transform sm:translate-x-0"/>
                  <div className="ml-0 flex h-full flex-col transition-all sm:ml-64">
                    <Nav_bar LeftContent={<DrawerModal />}/>
                    <div
                      id="Full_Content"
                      className="flex h-full w-full flex-col justify-between gap-4 overflow-auto"
                    >
                      <div
                        id="Middle_Content"
                        className="flex size-full gap-4 overflow-auto"
                      >
                        <div
                          id="content"
                          className="flex size-full min-w-72 flex-col overflow-auto"
                        >
                          {children}
                        </div>

                        {/* Queue */}
                        <TrackListQueue
                          className="h-full self-start"
                          canShow={showQueue}
                        />
                      </div>

                      <div
                        id="Bottom_Content"
                        className="flex flex-col items-center gap-8"
                      >
                        <AudioPlayer
                          className=""
                          {...{ showQueue, setShowQueue }}
                        />
                        <Footer />
                      </div>
                    </div>
                  </div>
                </div>
              </PlaybackProvider>
            </TrackManagerProvider>
          </TrackListProvider>
        </FavoriteTracksProvider>
      </DeletedTracksProvider>
    </>
  );
}
