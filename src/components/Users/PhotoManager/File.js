import React, {useEffect} from "react";
import clone from "lodash/clone";


export default function File(props) {
    const {open, setOpen} = props;
    const {
        disabled,
        files,
        setFiles,
        setLoading
    } = props;
    let inputfileprod = React.createRef();

    useEffect(() => {
        console.log(open)
        if (!!open)
           inputfileprod.current.click();
    }, [open]);

    const handleChangeFileAssetLanguage = (e) => {
        e.preventDefault();
        //Preview
        let fotos = [];
        setLoading(true);
        for (let i = 0; i < inputfileprod.current.files.length; i++) {
            let filename = inputfileprod.current.files[i].name.replace(/[^a-zA-Z0-9]/g, '_');
            Object.defineProperty(inputfileprod.current.files[i], 'name', {
                writable: true,
                value: filename
            });
            fotos.push(inputfileprod.current.files[i]);
        }
        let fotosClone = clone(files);
        fotosClone[0] = fotos[0];
        setFiles(fotosClone);
        // setFiles(union(fotosClone, fotos));
        setOpen(false);
    };

    return (
        <React.Fragment>
            <input disabled={disabled} ref={inputfileprod} type="file" name="mainFilePost" id={"mainFilePost"}
                   className="inputfile"
                   accept="image/*"
                   style={{display: "none"}}
                   onChange={(e) => handleChangeFileAssetLanguage(e)}
            />
        </React.Fragment>
    );
}
