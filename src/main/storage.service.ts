import { Memento } from 'vscode'

export class StorageService {
    
    constructor(private storage: Memento) {}   
    
    public get(key : string): unknown {
      return this.storage.get(key)
    }

    public update(key: string, value: unknown) {
        this.storage.update(key, value)
    }
}