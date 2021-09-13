import { Plugin, TFile } from 'obsidian';

const FILE_COPY_ICON = "two-blank-pages"


export default class CopyPlugin extends Plugin {

	async onload() {
		console.log('Loading copy note...');

		this.addCommand({
			id: 'copy-note',
			name: 'Copy active note',
			icon: FILE_COPY_ICON, //Obsidian default copy icon

			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				const activeView = this.app.workspace.getActiveFile(); //return TFile

				if (leaf && activeView) { //only show command if active note exists
					if (!checking ) {
						this.copyInFolder(activeView);
					}
					return true;
				}
				return false;
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu) => {
				menu.addItem((item) => { item
					.setTitle("Make a copy")
					.setIcon(FILE_COPY_ICON)
					.onClick(() => { 
						const activeView = this.app.workspace.getActiveFile(); //return TFile
						this.copyInFolder(activeView) });
				});
			})
		);
	}

	//copy a file to the same folder with name "Old Name 1"
	copyInFolder(originalFile: TFile) {
		const folderPath = originalFile.parent.path
		const newFile = folderPath + "/" + originalFile.basename + " 1." + originalFile.extension 
		this.app.vault.copy(originalFile, newFile)
	}

	onunload() {
		console.log('Unloading copy note');
	}


}


