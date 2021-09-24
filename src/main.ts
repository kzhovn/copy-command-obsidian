import { Plugin, TFile, TFolder } from 'obsidian';

const FILE_COPY_ICON = "documents"
const FOLDER_COPY_ICON = "two-blank-pages"

export default class CopyPlugin extends Plugin {

	async onload() {
		console.log('Loading copy note...');

		this.addCommand({
			id: 'copy-note',
			name: 'Copy active note',
			icon: FILE_COPY_ICON, //Obsidian default copy icon

			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile(); //return TFile

				if (activeFile) { //only show command if active note exists
					if (!checking ) {
						this.copyFile(activeFile, activeFile.parent);
					}
					return true;
				}
				return false;
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, abstractFile, source) => {
				if (abstractFile instanceof TFile && source === "pane-more-options") { //file *not in file explorer menu (to avoid overlap with native command)
					menu.addItem((item) => { item
						.setTitle("Make a copy")
						.setIcon(FILE_COPY_ICON)
						.onClick(() => { 
							this.copyFile(abstractFile, abstractFile.parent);
						 });
					});
				} else if (abstractFile instanceof TFolder && source === "file-explorer-context-menu") {
					menu.addItem((item) => { item
						.setTitle("Copy folder")
						.setIcon(FOLDER_COPY_ICON)
						.onClick(() => { 
							this.copyFolder(abstractFile, abstractFile.parent);
						 });
					});
				}
			})
		);
	}

	//copy a file to newFolder with name "Old Name 1"
	async copyFile(originalFile: TFile, newFileLocation: TFolder, nameSuffix = " 1", openFile = true) {		
		let newFileLocationPath = newFileLocation.path;	
		
		const newFilePath = newFileLocationPath + "/" + originalFile.basename + nameSuffix + "." + originalFile.extension;
		const newFile = await this.app.vault.copy(originalFile, newFilePath);

		if (openFile === true) { 
			this.app.workspace.getLeaf().openFile(newFile);
		}
	}

	//recursively copy a folder with name "Old Name 1" to newFolder, without renaming the contents
	async copyFolder(originalFolder: TFolder, newFolderLocation: TFolder, nameSuffix = " 1") {
		let newFolderPath;
		
		if (newFolderLocation.path === "/") {
			newFolderPath = originalFolder.name + nameSuffix;
		} else {
			newFolderPath = newFolderLocation.path + "/" + originalFolder.name + nameSuffix;	
		}

		await this.app.vault.createFolder(newFolderPath);
		const newFolder = this.app.vault.getAbstractFileByPath(newFolderPath);

		//@ts-ignore I promise it's a folder I just made it if it isn't we have problems
		for (const child of originalFolder.children) {
			if (child instanceof TFile) {
				//@ts-ignore
				await this.copyFile(child, newFolder, "", false); //no file name suffix, do not open after copying
			} else if (child instanceof TFolder) {
				//@ts-ignore
				await this.copyFolder(child, newFolder, "");
			}
		}
	}

	onunload() {
		console.log('Unloading copy note');
	}


}


