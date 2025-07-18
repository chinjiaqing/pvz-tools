import pkg from './package.json' with { type: 'json' }

export default {
    appId: pkg.author,
    asar: true,
    productName: pkg.name,
    directories: {
        output: 'release/${version}',
        buildResources: 'build'
    },
    extraResources: [
        {
            from: 'resources/',
            to: 'resources',
            filter: ['**/*']
        }
    ],
    files: [
        'out/main/**/*',
        'out/preload/**/*',
        'out/renderer/**/*',
        '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
        '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
        '!**/*.map',
        '!**/.vscode/*',
        '!src/*',
        '!electron.vite.config.{js,ts,mjs,cjs}',
        '!{.eslintcache,eslint.config.mjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
        '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
        '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
    ],
    mac: {
        target: ['dmg'],
        artifactName: '${productName}-Mac-${version}-Installer.${ext}'
    },
    win: {
        requestedExecutionLevel: 'requireAdministrator',
        target: [
            {
                target: 'nsis',
                arch: ['x64']
            }
        ],
        icon: 'resources/icon.png',
        artifactName: '${productName}-Windows-${version}-Setup.${ext}',
        "publish": [
            {
                "provider": "github"
            }
        ]
    },
    nsis: {
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: false,
        createDesktopShortcut: true,
        createStartMenuShortcut: true
    },
    linux: {
        target: ['AppImage'],
        artifactName: '${productName}-Linux-${version}.${ext}'
    }
}
