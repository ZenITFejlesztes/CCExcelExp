import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { parseObject } from "./parser";
import { createExcel } from "./generateExcel";
import { bytesToBase64 } from "./base64conv";

interface MyStyles {
    primaryColor: string;
    secondaryColor: string;
}

export class ExcelExport implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private context: ComponentFramework.Context<IInputs>;
    private hostContainer: HTMLDivElement;
    private topContainer: HTMLDivElement;
    private notifyOutputChanged: ()=> void;
    private myButton: HTMLButtonElement;
    private style: MyStyles = {
        primaryColor: "lightgray",
        secondaryColor: "black"
    }
    private fontsize: number;
    private filename: string;
    private colJson: string;


	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.hostContainer = container;
        this.hostContainer.className = "hostContainer";
        this.topContainer = document.createElement("div");
        this.topContainer.className = "topContainer";
        this.myButton = document.createElement("button");
        this.myButton.className = "myButton";
        this.myButton.innerText = "EXPORT";
        this.myButton.onclick = this.onBtnClick;
        this.updateStyles();
        this.topContainer.appendChild(this.myButton)
        this.hostContainer.appendChild(this.topContainer)
	}


	
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
        this.context = context;
        this.style = {
            primaryColor: context.parameters.xPrimaryColor.raw || this.style.primaryColor,
            secondaryColor: context.parameters.xSecondaryColor.raw || this.style.secondaryColor
        }
        this.filename = context.parameters.xFileName.raw || "export.xlsx";
        this.colJson = context.parameters.xCollJSONString.raw || this.colJson;
        this.updateStyles();
        this.fontsize = Math.floor( Math.max( this.hostContainer.clientWidth, this.hostContainer.clientHeight ) / 12 );
        this.topContainer.style.fontSize = `${this.fontsize}px`
    }

	public getOutputs(): IOutputs
	{
		return {};
	}

	public destroy(): void
    {}
    
    private updateStyles = (): void => {
        this.myButton.style.backgroundColor = this.style.primaryColor;
        this.myButton.style.color = this.style.secondaryColor;
    }

    private onBtnClick = async (): Promise<void> => {
        // getting the file
        if (!this.colJson) return
        const collArr: object[] = JSON.parse(this.colJson);
        if (!Array.isArray(collArr)) { console.log("the input is not an array!"); return }
        const collObj = parseObject(collArr);
        const excelBuff = await createExcel(collObj, collArr.length);
        const excelBase64 = bytesToBase64(excelBuff);
        this.downloadFile(excelBase64);
    }

    private downloadFile = (base64String: string): void=> {
        if (!base64String || !this.filename) return
        const dataURI = "data:" + "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" + ";base64," + base64String
        const fileName = this.filename
        
        let link = document.createElement("a");
        link.download = fileName;
        link.href = dataURI;
        link.style.display = "none";
        this.hostContainer.appendChild(link);
        link.click();
        link.remove();
    }
}