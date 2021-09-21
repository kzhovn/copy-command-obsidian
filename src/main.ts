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
				const activeView = this.app.workspace.getActiveFile(); //return TFile

				if (activeView) { //only show command if active note exists
					if (!checking ) {
						this.copyInFolder(activeView);
					}
					return true;
				}
				return false;
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {

				//don't show in menu if I don't have a file open
				if (source !== "pane-more-options") {
					return;
				}

				menu.addItem((item) => { item
					.setTitle("Make a copy")
					.setIcon(FILE_COPY_ICON)
					.onClick(() => { 
						if (file instanceof TFile) {
							this.copyInFolder(file);
						}
					 });
				});
			})
		);
	}

	//copy a file to the same folder with name "Old Name 1"
	async copyInFolder(originalFile: TFile) {
		const folderPath = originalFile.parent.path;
		const newFilePath = folderPath + "/" + originalFile.basename + " 1." + originalFile.extension;
		const newFile = await this.app.vault.copy(originalFile, newFilePath);

		this.app.workspace.getLeaf().openFile(newFile);
	}

	onunload() {
		console.log('Unloading copy note');
	}


}


