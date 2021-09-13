import { Plugin } from 'obsidian';

export default class CopyPlugin extends Plugin {

	async onload() {
		console.log('Loading copy note...');

		this.addCommand({
			id: 'copy-note',
			name: 'Copy active note',
			icon: 'two-blank-pages', //Obsidian default copy icon

			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				const activeView = this.app.workspace.getActiveFile(); //return TFile

				if (leaf && activeView) { //only show command if active note exists
					if (!checking ) {
							const folderPath = activeView.parent.path
							const newFile = folderPath + "/" + activeView.basename + " 1." + activeView.extension 
							this.app.vault.copy(activeView, newFile)
					
					}
					return true;
				}
				return false;
			}
		});
	}

	onunload() {
		console.log('Unloading copy note');
	}
}


