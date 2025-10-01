import React from 'react'

export default function CFooter() {
    return (
        <footer className="bg-gray-100 text-gray-600 py-6 mt-20">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    © 2025 Ôn thi OPIC by{' '}
                    <a href="https://fb.com/trongandev" target="_blank" className="text-primary underline">
                        trongandev
                    </a>
                    . All rights reserved.
                </p>
            </div>
        </footer>
    )
}
