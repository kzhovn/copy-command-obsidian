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
				if (leaf) {
					if (!checking) {
						const activeView = this.app.workspace.getActiveFile(); //return TFile
						if (activeView) { // if it exists
							const path = activeView.parent.path
							const newFile = path + "/" + activeView.basename + " 1" + activeView.extension 
							this.app.vault.copy(activeView, newFile)
						}
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


