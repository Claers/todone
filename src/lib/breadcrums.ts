import { breadcrumbsStore } from "$lib/store";

// Enum the different pages
export enum Pages {
    HOME = "home",
    TASKS = "tasks",
    TASK = "task",
    TASKS_STATUS = "tasks_status",
}

// Check if the page id is already in the breadcrumbs
export function isPageInBreadcrumbs(id: string, breadcrumbs: {name: string, path: string, id: string}[]) {
    return breadcrumbs.some((breadcrumb) => {
        return breadcrumb.id === id;
    });
}

// Add a path to the breadcrumbs
export function addPathToBreadcrumbs(name: string, path: string, id: string, breadcrumbs: {name: string, path: string, id: string}[] ) {
        // console.log(isPageInBreadcrumbs(id, breadcrumbs));
        if (!isPageInBreadcrumbs(id, breadcrumbs)) {
        console.log("addPathToBreadcrumbs");
        breadcrumbsStore.update((oldBreadcrumbs) => {
            return [...oldBreadcrumbs, {name, path, id}];
        }
        );
    } else {
        // Update the breadcrumbs of the id
            let newBreadcrumbs = breadcrumbs.map((breadcrumb) => {
                if (breadcrumb.id === id) {
                    return {name, path, id};
                } else {
                    return breadcrumb;
                }
            });
            breadcrumbsStore.set(newBreadcrumbs);
    }
}

// Remove breadcrumbs after path
export function removeBreadcrumbsAfterID(id: string, breadcrumbs: { name: string, path: string, id: string }[]) {
    // console.log("removeBreadcrumbsAfterID");
    let newBreadcrumbs = [];
    let index = breadcrumbs.findIndex((breadcrumb) => {
        return breadcrumb.id === id;
    });
    if (index !== -1) {
        newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    } else {
        newBreadcrumbs = breadcrumbs;
    }
    breadcrumbsStore.set(newBreadcrumbs);
}

export function goBack() {
    breadcrumbsStore.update((oldBreadcrumbs) => {
        return oldBreadcrumbs.slice(0, oldBreadcrumbs.length - 1);
    });
}