#!/usr/bin/env nextflow

// Santa's Present Pipeline 🎅
// Run with: nextflow run christmas_pipeline.nf --reindeer [your guess]

process PREPARE_SLEIGH {
    debug true
    
    input:
    val reindeer

    output:
    val 'ready'

    script:
    """
    echo "🛷 Preparing Santa's sleigh with ${reindeer} in the lead..."
    sleep 1
    """
}

process LOAD_PRESENTS {
    debug true
    input:
    val status

    output:
    val 'loaded'

    script:
    """
    echo "🎁 Loading presents onto the sleigh..."
    sleep 2
    """
}

process DELIVER_PRESENTS {
    debug true
    input:
    val status

    script:
    """
    echo "🎅 Ho ho ho! Santa is delivering presents!"
    echo "🎄 Checking the naughty/nice list..."
    echo "🗺️  Calculating optimal present delivery route..."
    echo "🌟 Running nextflow magic algorithms..."
    echo "🦌 Reindeer power optimization complete!"
    echo "🎅 Here's your special Nextflow present:"
    echo "🎁 The next secret key is: MerryNextChristmas"
    """
}

// Main workflow
workflow {
    // Define valid reindeer (encoded to keep the magic alive! 🎄)
    params.reindeer = null
    def encoded_reindeer = "cnVkb2xwaA=="
    def valid_reindeer = new String(encoded_reindeer.decodeBase64()).tokenize(',')

    // Input validation
    if (!params.reindeer) {
        error "Ho ho NO! No reindeer specified! Please provide a reindeer with --reindeer [name]."
    }

    if (!valid_reindeer.contains(params.reindeer.toLowerCase())) {
        error "Ho ho NO! Invalid reindeer specified: '${params.reindeer}'. Santa needs the right reindeer! 🦌"
    }
    
    // Create the workflow chain
    PREPARE_SLEIGH(params.reindeer)
    | LOAD_PRESENTS
    | DELIVER_PRESENTS
} 