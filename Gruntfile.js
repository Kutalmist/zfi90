"use strict"

module.exports = function (grunt){

    var userName = grunt.option("user");
    var password = grunt.option("pwd");
    var requestNo = grunt.option("requestNo");

    grunt.initConfig({
        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: "https://fioritserver.sadal.com.tr:44300/",
                    client: "100",
                    useStrictSSL: false
                },
                auth: {
                    user: userName,
                    pwd: password
                }
            },
            upload_webapp: {
                options: {
                    ui5: {
                        package: "ZFIORI",
                        bspcontainer: "ZFI_UI5_001",
                        bspcontainer_text: "Müşteri Kredi Limiti İzleme",
                        transportno: requestNo,
                        calc_appindex: true
                    },
                    resources: {
                        cwd: "webapp",
                        src: "**/*.*"
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

    grunt.registerTask("default", ["nwabap_ui5uploader"]);
}