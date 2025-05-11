import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Simple debug endpoint
export async function GET() {
  try {
    const debug = {};
    
    // Check process.cwd()
    debug.cwd = process.cwd();
    
    // Check if base directory exists
    const baseDir = path.join(process.cwd(), 'app/case-studies/assets');
    debug.baseDir = baseDir;
    debug.baseDirExists = fs.existsSync(baseDir);
    
    // List folders in base dir
    if (debug.baseDirExists) {
      try {
        debug.folders = fs.readdirSync(baseDir);
        
        // Check case study folders
        debug.caseStudyFolders = debug.folders.filter(f => f.startsWith('case-study-'));
        
        // Check first case study folder
        if (debug.caseStudyFolders.length > 0) {
          const firstFolder = debug.caseStudyFolders[0];
          const firstFolderPath = path.join(baseDir, firstFolder);
          
          debug.firstFolder = firstFolder;
          debug.firstFolderPath = firstFolderPath;
          debug.firstFolderExists = fs.existsSync(firstFolderPath);
          
          if (debug.firstFolderExists) {
            debug.firstFolderFiles = fs.readdirSync(firstFolderPath);
            
            // Check if markdown file exists
            const mdFile = debug.firstFolderFiles.find(f => f.endsWith('.md'));
            if (mdFile) {
              debug.mdFile = mdFile;
              debug.mdFilePath = path.join(firstFolderPath, mdFile);
              debug.mdFileExists = fs.existsSync(debug.mdFilePath);
              
              if (debug.mdFileExists) {
                // Get file stats 
                const stats = fs.statSync(debug.mdFilePath);
                debug.mdFileSize = stats.size;
                debug.mdFileCreated = stats.birthtime;
                debug.mdFileModified = stats.mtime;
                
                // Read first few lines of the file
                const fileContent = fs.readFileSync(debug.mdFilePath, 'utf8');
                debug.mdFileFirstLines = fileContent.split('\n').slice(0, 5).join('\n');
              }
            }
          }
        }
      } catch (folderError) {
        debug.folderError = folderError.message;
      }
    }
    
    // Get information about the public directory
    const publicDir = path.join(process.cwd(), 'public');
    debug.publicDir = publicDir;
    debug.publicDirExists = fs.existsSync(publicDir);
    
    if (debug.publicDirExists) {
      debug.publicFolders = fs.readdirSync(publicDir);
      
      // Check public/assets directory for case studies
      const assetsDir = path.join(publicDir, 'assets');
      debug.assetsDir = assetsDir;
      debug.assetsDirExists = fs.existsSync(assetsDir);
      
      if (debug.assetsDirExists) {
        debug.assetsFolders = fs.readdirSync(assetsDir);
        
        // Check for case study folders
        debug.caseStudyAssetFolders = debug.assetsFolders.filter(f => f.startsWith('case-study-'));
        
        // Check first case study folder in assets
        if (debug.caseStudyAssetFolders.length > 0) {
          const firstAssetFolder = debug.caseStudyAssetFolders[0];
          const firstAssetFolderPath = path.join(assetsDir, firstAssetFolder);
          
          debug.firstAssetFolder = firstAssetFolder;
          debug.firstAssetFolderPath = firstAssetFolderPath;
          debug.firstAssetFolderExists = fs.existsSync(firstAssetFolderPath);
          
          if (debug.firstAssetFolderExists) {
            debug.firstAssetFolderFiles = fs.readdirSync(firstAssetFolderPath);
          }
        }
      }
      
      // Check case studies symlink (old location)
      const caseStudiesPublicDir = path.join(publicDir, 'case-studies');
      debug.caseStudiesPublicDir = caseStudiesPublicDir;
      debug.caseStudiesPublicDirExists = fs.existsSync(caseStudiesPublicDir);
      
      if (debug.caseStudiesPublicDirExists) {
        debug.caseStudiesPublicFolders = fs.readdirSync(caseStudiesPublicDir);
        
        // Check assets folder
        const assetsPublicDir = path.join(caseStudiesPublicDir, 'assets');
        debug.assetsPublicDir = assetsPublicDir;
        debug.assetsPublicDirExists = fs.existsSync(assetsPublicDir);
        
        if (debug.assetsPublicDirExists) {
          try {
            const stats = fs.lstatSync(assetsPublicDir);
            debug.assetsPublicDirIsSymlink = stats.isSymbolicLink();
            if (debug.assetsPublicDirIsSymlink) {
              debug.assetsPublicDirSymlinkTarget = fs.readlinkSync(assetsPublicDir);
            }
          } catch (symlinkError) {
            debug.symlinkError = symlinkError.message;
          }
        }
      }
    }
    
    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 