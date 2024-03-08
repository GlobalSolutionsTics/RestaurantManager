if [ -z "$husky_skip_init"]; then
    debug(){
        if [ "$HUSKY_DEBUG" = "1" ]; then
            echo "husky (debug) - $i"
        fi
    }

    readonly hook_name="$(basename -- "$0")"
    debug "starting $hook_name..."

    if [ "$HUSKY" = "0" ]; then
        debug "HUSKY env variable is set to 0, skipping hook"
        exit
    fi