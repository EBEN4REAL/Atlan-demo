export function usePackageInfo() {
    const metadata = (pkg) => pkg?.metadata
    const labels = (pkg) => metadata(pkg)?.labels

    const annotations = (pkg) => metadata(pkg)?.annotations

    const author = (pkg) => annotations(pkg)?.['package.argoproj.io/author']
    const name = (pkg) => annotations(pkg)?.['orchestration.atlan.com/name']
    const identifier = (pkg) => annotations(pkg)?.['package.argoproj.io/name']
    const icon = (pkg) => annotations(pkg)?.['orchestration.atlan.com/icon']
    const emoji = (pkg) => annotations(pkg)?.['orchestration.atlan.com/emoji']
    const logo = (pkg) => annotations(pkg)?.['orchestration.atlan.com/logo']

    const type = (pkg) => labels(pkg)?.['orchestration.atlan.com/type']

    const version = (pkg) => labels(pkg)?.['package.argoproj.io/version']

    return {
        metadata,
        annotations,
        labels,
        author,
        name,
        identifier,
        icon,
        logo,
        emoji,
        type,
        version,
    }
}
