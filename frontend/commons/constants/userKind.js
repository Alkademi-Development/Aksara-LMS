const userKind = (kind) => {
    // Set the roles for filtering menu sidebars
    switch (kind) {
        case 0:
            return 'superadmin';
            break;
        case 1:
            return 'admin';
            break;
        case 2:
            return 'mentor';
            break;
        case 3:
            return 'teacher';
            break;
        case 4:
            return 'student';
            break;
        case 5:
            return 'industry';
            break;
        case 6:
            return 'writer';
            break;
        case 7:
            return 'lead_program';
            break;
        case 8:
            return 'partner';
            break;
        case 9:
            return 'lead_region';
            break;
        default:
            return null;
            break;
    }
}

export { userKind }