"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  IconArrowBackUp, 
  IconSettings, 
  IconMaximize, 
  IconDotsVertical,
  IconLayoutGrid,
  IconLayoutColumns,
  IconLayoutGridAdd,
  IconLayout2,
  IconLayoutSidebarLeftCollapse
} from "@tabler/icons-react";

interface PlaygroundHeaderProps {
  modelCount: 1 | 2 | 3 | 4 | 6;
  setModelCount: (count: 1 | 2 | 3 | 4 | 6) => void;
}

const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({ modelCount, setModelCount }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">Playground</h1>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-neutral-900 rounded-md p-0.5 mr-2">
          <Button 
            variant={modelCount === 1 ? "default" : "ghost"} 
            size="sm" 
            className="h-8 w-8 px-0"
            onClick={() => setModelCount(1)}
            title="Single Model"
          >
            <IconLayoutSidebarLeftCollapse className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={modelCount === 2 ? "default" : "ghost"} 
            size="sm" 
            className="h-8 w-8 px-0"
            onClick={() => setModelCount(2)}
            title="Compare 2 Models"
          >
            <IconLayoutColumns className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={modelCount === 3 ? "default" : "ghost"} 
            size="sm" 
            className="h-8 w-8 px-0"
            onClick={() => setModelCount(3)}
            title="Compare 3 Models"
          >
            <IconLayout2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={modelCount === 4 ? "default" : "ghost"} 
            size="sm" 
            className="h-8 w-8 px-0"
            onClick={() => setModelCount(4)}
            title="Compare 4 Models"
          >
            <IconLayoutGridAdd className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={modelCount === 6 ? "default" : "ghost"} 
            size="sm" 
            className="h-8 w-8 px-0"
            onClick={() => setModelCount(6)}
            title="Compare 6 Models"
          >
            <IconLayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo">
          <IconArrowBackUp className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Settings">
          <IconSettings className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Expand">
          <IconMaximize className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" title="More Options">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundHeader;
