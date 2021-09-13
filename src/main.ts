import { Plugin, Vault } from 'obsidian';

export default class MyPlugin extends Plugin {

	async onload() {
		console.log('Loading copy note...');

		this.addCommand({
			id: 'copy-note',
			name: 'Copy active note',
			icon: 'two-blank-pages',

			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				const activeView = this.app.workspace.getActiveFile(); //return TFile

				if (leaf && activeView) {
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


