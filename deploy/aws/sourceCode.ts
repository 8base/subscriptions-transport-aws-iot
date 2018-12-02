import * as archiver from "archiver";
import * as path from "path";
import * as fs from "fs";
import { functions } from "./predefine";
import { dependencies } from './dependencies';

const pathToActions = path.join("deploy", "actions");

export namespace SourceCode {

    export async function archive(config: string): Promise<{ path: string } > {

        const lib = path.join(__dirname, "../../");
        const root = path.join(__dirname, "../../../");
        const deployFile = path.join(root, 'deploy.zip');
        const output = fs.createWriteStream(deployFile);
        const nodeModulesPath = path.join(root, "node_modules");

        const archive = archiver('zip', { zlib: { level: 8 } });

        archive.pipe(output);

        archive.append(config, { name: path.join("deploy", "actions", "staticConfig.json") });

        let indexFile = "";
        functions.map(f => indexFile+=`exports.${f.name} = require("./${path.join(pathToActions, f.name)}").handler;\n`);
        archive.append(indexFile, { name: "index.js" });

        fs.readdirSync(nodeModulesPath)
            .map(m => {
                if (dependencies.includes(m)) {
                    archive.directory(path.join(nodeModulesPath, m), path.join("node_modules", m));
                }
            });

        archive.directory(path.join(lib, "src"), "src");
        archive.directory(path.join(lib, "deploy", "actions"), path.join("deploy", "actions"));

        return new Promise<{path: string}>((resolve, reject) => {

            archive.on("end", async () => {
                resolve( {
                    path: deployFile
                });
            });

            archive.on('error', function(err: Error) {
                reject(err);
            });

            archive.finalize();
        });
    }

    export function removeArchive(archive: string) {
        fs.unlinkSync(archive);
    }


}
