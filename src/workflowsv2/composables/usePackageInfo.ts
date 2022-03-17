export function usePackageInfo() {
    const metadata = (pkg) => pkg.metadata
    const annotations = (pkg) => metadata(pkg)?.annotations
    const author = (pkg) => annotations(pkg)?.['package.argoproj.io/author']
    const name = (pkg) => annotations(pkg)?.['orchestration.atlan.com/name']
    const identifier = (pkg) => annotations(pkg)?.['package.argoproj.io/name']
    const icon = (pkg) => annotations(pkg)?.['orchestration.atlan.com/icon']
    const logo = (pkg) => annotations(pkg)?.['orchestration.atlan.com/logo']

    return { metadata, annotations, author, name, identifier, icon, logo }
}
