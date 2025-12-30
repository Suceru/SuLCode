export namespace main {
	
	export class NodeData {
	    id: string;
	    type: string;
	    x: number;
	    y: number;
	    properties: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new NodeData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.type = source["type"];
	        this.x = source["x"];
	        this.y = source["y"];
	        this.properties = source["properties"];
	    }
	}

}

