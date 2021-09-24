import { Plugin, TFile, TFolder } from 'obsidian';

const FILE_COPY_ICON = "two-blank-pages"

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
						.setIcon(FILE_COPY_ICON)
						.onClick(() => { 
							this.copyFolder(abstractFile);
						 });
					});
				}
			})
		);
	}

	//copy a file to newFolder with name "Old Name 1"
	async copyFile(originalFile: TFile, newFolder: TFolder) {
		const folderPath = newFolder.path;
		const newFilePath = folderPath + "/" + originalFile.basename + " 1." + originalFile.extension;
		const newFile = await this.app.vault.copy(originalFile, newFilePath);

		this.app.workspace.getLeaf().openFile(newFile);
	}

	//recursively copy a folder with name "Old Name 1" to folder newFolder
	async copyFolder(originalFolder: TFolder) {
		const folderPath = originalFolder.parent.path;
		const newFolderPath = folderPath + "/" + originalFolder.name + " 1";
		await this.app.vault.createFolder(newFolderPath);

		const newFolder = this.app.vault.getAbstractFileByPath(newFolderPath);

		//@ts-ignore I promise it's a folder I just made it if it isn't we have problems
		for (const child of originalFolder.children) {
			if (child instanceof TFile) {
				//@ts-ignore
				this.copyFile(child, newFolder);
			} else if (child instanceof TFolder) {
				//@ts-ignore
				this.copyFolder(child, newFolder);
			}
		}
	}

	onunload() {
		console.log('Unloading copy note');
	}


}


