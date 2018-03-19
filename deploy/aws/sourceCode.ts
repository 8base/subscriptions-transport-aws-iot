import * as archiver from "archiver";
import * as path from "path";
import * as fs from "fs";

export namespace SourceCode {

    export async function archive(config: string, ): Promise<{ path: string } > {

        const lib = path.join(__dirname, "../../");
        const root = path.join(__dirname, "../../../");
        const deployFile = path.join(root, 'deploy.zip');
        const output = fs.createWriteStream(deployFile);
        const nodeModulesPath = path.join(root, "node_modules");

        const archive = archiver('zip', {});

        archive.pipe(output);

        archive.append(config, { name: "config.json" });
        archive.directory(nodeModulesPath, "node_modules");
        archive.directory(path.join(lib, "src"), "src");
        archive.directory(path.join(lib, "deploy", "actions"), false);

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
