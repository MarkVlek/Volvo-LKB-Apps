import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { TestKeyComponent } from '../components/test-keyboard/test-key/test-key.component';
import { TestKeyboardComponent } from '../components/test-keyboard/test-keyboard.component';
import { MaterialModule } from './material.module';
import { SafePipe } from '../pipes/sanitize.pipe';
import { CarpayIframeComponent } from '../components/carpay-iframe/carpay-iframe.component';
import { RemoveCharsPipe } from '../pipes/removeCharsAtIndex.pipe';
import { MaskedOverflowDirective } from '../directives/masked-overflow.directive';
import { ThousandSeparatorPipe } from '../pipes/thusands-seperator.pipe'

@NgModule({
    declarations: [
        TestKeyboardComponent,
        TestKeyComponent,
        CarpayIframeComponent,
        SafePipe,
        RemoveCharsPipe,
        ThousandSeparatorPipe,
        MaskedOverflowDirective,
    ],
    imports: [
        BrowserModule,
        MaterialModule
    ],
    exports: [
        TestKeyboardComponent,
        TestKeyComponent,
        SafePipe,
        RemoveCharsPipe,
        ThousandSeparatorPipe,
        CarpayIframeComponent,
        MaskedOverflowDirective
    ]
})

export class SharedModule { }