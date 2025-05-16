<?php

namespace Drupal\styleguide\Controller;

use Drupal\Core\Controller\ControllerBase;

class StyleGuideController extends ControllerBase {
  public function view() {
    return [
      '#theme' => 'styleguide',
    ];
  }
}
